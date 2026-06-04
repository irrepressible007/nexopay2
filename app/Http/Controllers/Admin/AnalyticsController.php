<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $eventId = $request->input('event_id');
        
        $events = Event::select('id', 'title', 'status')->latest()->get();

        $stats = [
            'total_revenue' => 0,
            'total_registrations' => 0,
            'approved_registrations' => 0,
            'pending_registrations' => 0,
            'rejected_registrations' => 0,
            'registrations_by_role' => [],
            'total_users' => User::count(),
            'total_events' => Event::count(),
            'active_events' => Event::where('status', 'upcoming')->count(),
        ];

        $query = Registration::query()->with('role');

        if ($eventId) {
            $query->where('event_id', $eventId);
        }

        $registrations = $query->get();

        $stats['total_registrations'] = $registrations->count();
        $stats['approved_registrations'] = $registrations->where('status', 'approved')->count();
        $stats['pending_registrations'] = $registrations->where('status', 'pending')->count();
        $stats['rejected_registrations'] = $registrations->where('status', 'rejected')->count();
        
        // Revenue is calculated only from approved registrations
        $stats['total_revenue'] = $registrations->where('status', 'approved')->sum('payable_amount');

        // Group by Role
        $roleBreakdown = $registrations->groupBy(function($reg) {
            return $reg->role ? $reg->role->name : 'Unknown';
        });

        foreach ($roleBreakdown as $roleName => $regs) {
            $stats['registrations_by_role'][] = [
                'role' => $roleName,
                'count' => $regs->count(),
                'revenue' => $regs->where('status', 'approved')->sum('payable_amount'),
            ];
        }

        return Inertia::render('Admin/Analytics/Index', [
            'events' => $events,
            'selectedEventId' => $eventId,
            'stats' => $stats
        ]);
    }

    public function exportSummary(Request $request)
    {
        $eventId = $request->input('event_id');
        
        $query = Registration::query()->with(['role', 'event']);
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
        $registrations = $query->get();

        $filename = "analytics_summary_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($registrations, $eventId) {
            $file = fopen('php://output', 'w');

            // Global Summary
            fputcsv($file, ['NEXOPAY ANALYTICS SUMMARY']);
            fputcsv($file, ['Report Type', $eventId ? 'Event Specific' : 'Global']);
            fputcsv($file, ['Total Registrations', $registrations->count()]);
            fputcsv($file, ['Approved Registrations', $registrations->where('status', 'approved')->count()]);
            fputcsv($file, ['Total Revenue (Approved)', $registrations->where('status', 'approved')->sum('payable_amount')]);
            fputcsv($file, []);

            // Breakdown by Role
            fputcsv($file, ['ROLE BREAKDOWN']);
            fputcsv($file, ['Role', 'Total Registrations', 'Approved Revenue']);
            
            $roleBreakdown = $registrations->groupBy(function($reg) {
                return $reg->role ? $reg->role->name : 'Unknown';
            });

            foreach ($roleBreakdown as $roleName => $regs) {
                fputcsv($file, [
                    $roleName,
                    $regs->count(),
                    $regs->where('status', 'approved')->sum('payable_amount')
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportDetailed(Request $request)
    {
        $eventId = $request->input('event_id');
        
        $query = Registration::query()->with(['role', 'event', 'user']);
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
        
        $registrations = $query->get();
        $filename = "analytics_detailed_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($registrations) {
            $file = fopen('php://output', 'w');

            $cols = ['ID', 'Event', 'User Name', 'User Email', 'Role', 'Status', 'Payable Amount', 'bKash TXID', 'Registered At'];
            fputcsv($file, $cols);

            foreach ($registrations as $reg) {
                fputcsv($file, [
                    $reg->id,
                    $reg->event ? $reg->event->title : 'N/A',
                    $reg->user ? $reg->user->name : 'N/A',
                    $reg->user ? $reg->user->email : 'N/A',
                    $reg->role ? $reg->role->name : 'N/A',
                    $reg->status,
                    $reg->payable_amount,
                    $reg->bkash_txid,
                    $reg->created_at->toDateTimeString(),
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
