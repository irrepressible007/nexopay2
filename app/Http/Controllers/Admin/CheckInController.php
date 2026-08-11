<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckInController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CheckIn');
    }

    public function process(Request $request)
    {
        $request->validate([
            'qr_uuid' => 'required|string|exists:registrations,qr_uuid'
        ], [
            'qr_uuid.exists' => 'Invalid QR Code or Ticket ID.'
        ]);

        $registration = Registration::with(['user', 'event', 'role'])->where('qr_uuid', $request->qr_uuid)->firstOrFail();

        if ($registration->status !== 'approved') {
            return back()->with('error', 'This ticket is not approved yet.');
        }

        if ($registration->is_checked_in) {
            return back()->with('error', 'This ticket has already been checked in!');
        }

        $registration->update([
            'is_checked_in' => true,
            'progress_status' => 'Checked In'
        ]);

        $attendeeName = $registration->user?->name ?? $registration->guest_name ?? 'Guest';
        return back()->with('success', "Success! {$attendeeName} ({$registration->role->name}) has been checked in for {$registration->event->title}.");
    }
}
