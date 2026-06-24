<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use App\Mail\CustomAdminMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class MailController extends Controller
{
    public function index()
    {
        $todayCount = EmailLog::whereDate('created_at', Carbon::today())->count();
        $monthCount = EmailLog::whereMonth('created_at', Carbon::now()->month)
                               ->whereYear('created_at', Carbon::now()->year)
                               ->count();
        $lifetimeCount = EmailLog::count();
        
        $logs = EmailLog::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/Mails/Index', [
            'stats' => [
                'today' => $todayCount,
                'month' => $monthCount,
                'lifetime' => $lifetimeCount,
            ],
            'logs' => $logs,
        ]);
    }

    public function show(EmailLog $email)
    {
        return Inertia::render('Admin/Mails/Show', [
            'email' => $email,
        ]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'recipient' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'from_address' => 'nullable|email',
            'parent_id' => 'nullable|exists:email_logs,id',
        ]);

        $fromAddress = $request->from_address ?: 'support@nexopay.com.bd';
        $senderId = auth()->id();

        try {
            Mail::to($request->recipient)->send(
                new CustomAdminMail(
                    $request->subject, 
                    $request->message, 
                    $fromAddress,
                    $senderId,
                    $request->parent_id
                )
            );
            
            return back()->with('success', 'Custom email queued successfully!');
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
}
