<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Mail\RegistrationConfirmed;
use App\Mail\RegistrationRejectedMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class FinanceController extends Controller
{
    public function index()
    {
        $registrations = Registration::with(['user', 'event', 'role'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Finance/Index', [
            'registrations' => $registrations
        ]);
    }

    public function approve(Registration $registration)
    {
        if ($registration->status === 'approved') {
            return back()->with('error', 'Registration is already approved.');
        }

        $registration->update([
            'status' => 'approved',
            'progress_status' => 'Registration Confirmed',
            'qr_uuid' => (string) Str::uuid()
        ]);

        // Trigger Resend Email
        $recipientEmail = $registration->user ? $registration->user->email : $registration->guest_email;
        if ($recipientEmail) {
            try {
                Mail::to($recipientEmail)->send(new RegistrationConfirmed($registration));
            } catch (\Throwable $e) {
                return back()->with('error', 'Registration approved, but failed to send email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Registration approved and ticket sent!');
    }

    public function reject(Registration $registration)
    {
        if ($registration->status === 'rejected') {
            return back()->with('error', 'Registration is already rejected.');
        }

        $registration->update([
            'status' => 'rejected',
            'progress_status' => 'Registration Rejected - Invalid TxID',
        ]);

        // Trigger Resend Email for Rejection
        $recipientEmail = $registration->user ? $registration->user->email : $registration->guest_email;
        if ($recipientEmail) {
            try {
                Mail::to($recipientEmail)->send(new RegistrationRejectedMail($registration));
            } catch (\Throwable $e) {
                return back()->with('error', 'Registration rejected, but failed to send email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Registration rejected and user notified.');
    }

    public function resend(Registration $registration)
    {
        $recipientEmail = $registration->user ? $registration->user->email : $registration->guest_email;
        if (!$recipientEmail) {
            return back()->with('error', 'No email address found for this registration.');
        }

        if ($registration->status === 'approved') {
            if (empty($registration->qr_uuid)) {
                $registration->update(['qr_uuid' => (string) \Illuminate\Support\Str::uuid()]);
            }
            try {
                Mail::to($recipientEmail)->send(new RegistrationConfirmed($registration));
                return back()->with('success', 'Approval ticket resent successfully!');
            } catch (\Throwable $e) {
                return back()->with('error', 'Failed to resend approval email: ' . $e->getMessage());
            }
        } elseif ($registration->status === 'rejected') {
            try {
                Mail::to($recipientEmail)->send(new RegistrationRejectedMail($registration));
                return back()->with('success', 'Rejection email resent successfully!');
            } catch (\Throwable $e) {
                return back()->with('error', 'Failed to resend rejection email: ' . $e->getMessage());
            }
        }

        return back()->with('error', 'Registration is still pending. Cannot resend email.');
    }

    public function export(Request $request)
    {
        // Simple secure token check, or just rely on the admin middleware
        // Since we are using IMPORTDATA, we might want a signed URL or a secret token instead of auth middleware.
        // Let's implement a secret token approach for the Google Sheets API.
        $token = $request->query('token');
        $expectedToken = env('EXPORT_TOKEN');
        
        if (empty($expectedToken) || $token !== $expectedToken) {
            abort(403, 'Unauthorized export request.');
        }

        $registrations = Registration::with(['user', 'event', 'role'])->orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="nexopay_registrations.csv"',
        ];

        $callback = function() use ($registrations) {
            $file = fopen('php://output', 'w');
            
            // CSV Header
            fputcsv($file, [
                'ID', 'User Name', 'Email', 'Event', 'Role', 'TxID', 'Status', 'Date'
            ]);

            foreach ($registrations as $reg) {
                fputcsv($file, [
                    $reg->id,
                    $reg->user ? $reg->user->name : $reg->guest_name . ' (Guest)',
                    $reg->user ? $reg->user->email : $reg->guest_email,
                    $reg->event->title,
                    $reg->role->name,
                    $reg->bkash_txid,
                    $reg->status,
                    $reg->created_at->format('Y-m-d H:i:s')
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function destroy(Registration $registration)
    {
        // Actually delete the registration permanently
        $registration->delete();

        return back()->with('success', 'Registration permanently deleted.');
    }
}
