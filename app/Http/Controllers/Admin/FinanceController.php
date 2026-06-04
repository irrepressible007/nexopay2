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
            Mail::to($recipientEmail)->send(new RegistrationConfirmed($registration));
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
            Mail::to($recipientEmail)->send(new RegistrationRejectedMail($registration));
        }

        return back()->with('success', 'Registration rejected and user notified.');
    }

    public function export(Request $request)
    {
        // Simple secure token check, or just rely on the admin middleware
        // Since we are using IMPORTDATA, we might want a signed URL or a secret token instead of auth middleware.
        // Let's implement a secret token approach for the Google Sheets API.
        $token = $request->query('token');
        if ($token !== config('app.key')) {
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
}
