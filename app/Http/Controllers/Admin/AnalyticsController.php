<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $eventId = $request->input('event_id');
        $roleId = $request->input('role_id');
        $segmentKey = $request->input('segment_key');
        
        $events = Event::select('id', 'title', 'status', 'segments', 'cover_image')->latest()->get();
        $roles = Role::select('id', 'name')->get();

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

        $query = Registration::query()->with(['role', 'user', 'event']);

        if ($eventId) {
            $query->where('event_id', $eventId);
        }
        
        if ($roleId) {
            $query->where('role_id', $roleId);
        }

        $registrations = $query->get();

        // Extract Dynamic Columns
        $dynamicColumns = [];
        foreach ($registrations as $reg) {
            $formData = is_array($reg->form_data) ? $reg->form_data : [];
            foreach (array_keys($formData) as $key) {
                if (!in_array($key, $dynamicColumns)) {
                    $dynamicColumns[] = $key;
                }
            }
        }

        $stats['total_registrations'] = (int) $registrations->count();
        $stats['approved_registrations'] = (int) $registrations->where('status', 'approved')->count();
        $stats['pending_registrations'] = (int) $registrations->where('status', 'pending')->count();
        $stats['rejected_registrations'] = (int) $registrations->where('status', 'rejected')->count();
        
        // Revenue is calculated only from approved registrations
        $stats['total_revenue'] = (float) $registrations->where('status', 'approved')->sum('payable_amount');

        // Group by Role
        $roleBreakdown = $registrations->groupBy(function($reg) {
            return $reg->role ? $reg->role->name : 'Unknown';
        });

        foreach ($roleBreakdown as $roleName => $regs) {
            $stats['registrations_by_role'][] = [
                'role' => $roleName,
                'count' => (int) $regs->count(),
                'revenue' => (float) $regs->where('status', 'approved')->sum('payable_amount'),
            ];
        }

        return Inertia::render('Admin/Analytics/Index', [
            'events' => $events,
            'roles' => $roles,
            'selectedEventId' => $eventId,
            'selectedRoleId' => $roleId,
            'selectedSegmentKey' => $segmentKey,
            'stats' => $stats,
            'registrations' => $registrations,
            'dynamicColumns' => $dynamicColumns
        ]);
    }

    public function exportSummary(Request $request)
    {
        $eventId = $request->input('event_id');
        $roleId = $request->input('role_id');
        $segmentKey = $request->input('segment_key');
        
        $query = Registration::query()->with(['role', 'event']);
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
        if ($roleId) {
            $query->where('role_id', $roleId);
        }
        $registrations = $query->get();

        if ($segmentKey) {
            $registrations = $registrations->filter(function($reg) use ($segmentKey) {
                return $this->matchesSegment($reg, $segmentKey);
            });
        }

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
        $roleId = $request->input('role_id');
        $segmentKey = $request->input('segment_key');
        
        $query = Registration::query()->with(['role', 'event', 'user']);
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
        if ($roleId) {
            $query->where('role_id', $roleId);
        }
        
        $registrations = $query->get();

        if ($segmentKey) {
            $registrations = $registrations->filter(function($reg) use ($segmentKey) {
                return $this->matchesSegment($reg, $segmentKey);
            });
        }

        $filename = "analytics_detailed_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $dynamicColumns = [];
        foreach ($registrations as $reg) {
            $formData = is_array($reg->form_data) ? $reg->form_data : [];
            foreach (array_keys($formData) as $key) {
                if (!in_array($key, $dynamicColumns)) {
                    $dynamicColumns[] = $key;
                }
            }
        }

        $callback = function() use ($registrations, $dynamicColumns) {
            $file = fopen('php://output', 'w');

            $cols = ['ID', 'Event', 'User Name', 'User Email', 'Role', 'Status', 'Payable Amount', 'bKash TXID', 'bKash Sender Number', 'Registered At'];
            // Add dynamic columns
            $cols = array_merge($cols, $dynamicColumns);
            // Add Selected Segments Column
            $cols[] = 'Selected Segments';

            fputcsv($file, $cols);

            foreach ($registrations as $reg) {
                $userName = $reg->user ? $reg->user->name : ($reg->guest_name ?? 'N/A');
                $userEmail = $reg->user ? $reg->user->email : ($reg->guest_email ?? 'N/A');

                $row = [
                    $reg->id,
                    $reg->event ? $reg->event->title : 'N/A',
                    $userName,
                    $userEmail,
                    $reg->role ? $reg->role->name : 'N/A',
                    $reg->status,
                    $reg->payable_amount,
                    $reg->bkash_txid,
                    $reg->sender_number,
                    $reg->created_at->toDateTimeString(),
                ];

                $formData = is_array($reg->form_data) ? $reg->form_data : [];
                foreach ($dynamicColumns as $dc) {
                    $val = $formData[$dc] ?? '';
                    if (is_array($val)) {
                        $val = implode(', ', $val);
                    }
                    $row[] = $val;
                }

                // Format selected segments into human readable text
                $eventSegments = $reg->event ? ($reg->event->segments ?? []) : [];
                $segments = $this->formatSelectedSegmentsHumanReadable($reg->selected_segments, $eventSegments);
                $row[] = $segments;

                fputcsv($file, $row);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function matchesSegment($reg, $segmentKey): bool
    {
        if (empty($segmentKey)) return true;
        $sel = $reg->selected_segments;
        if (is_string($sel)) {
            $sel = json_decode($sel, true);
        }
        if (!is_array($sel)) return false;

        // 1. Direct segment check (global segment)
        if (isset($sel[$segmentKey]) && !empty($sel[$segmentKey])) {
            return true;
        }

        // 2. Sub-segment check
        foreach ($sel as $k => $val) {
            if ($k === '__options') continue;
            if (is_array($val) && in_array($segmentKey, $val)) return true;
            if (is_string($val) && $val === $segmentKey) return true;
        }

        // 3. Option check (in __options)
        if (isset($sel['__options']) && is_array($sel['__options'])) {
            foreach ($sel['__options'] as $subId => $optVal) {
                if (is_array($optVal) && in_array($segmentKey, $optVal)) return true;
                if (is_string($optVal) && $optVal === $segmentKey) return true;
            }
        }

        return false;
    }

    private function formatSelectedSegmentsHumanReadable($selectedSegments, array $eventSegments): string
    {
        if (is_string($selectedSegments)) {
            $selectedSegments = json_decode($selectedSegments, true);
        }
        if (empty($selectedSegments) || !is_array($selectedSegments) || empty($eventSegments)) {
            return '';
        }

        $list = [];
        $optionsMap = $selectedSegments['__options'] ?? [];

        foreach ($eventSegments as $seg) {
            $segId = $seg['id'] ?? null;
            if (!$segId || !isset($selectedSegments[$segId])) continue;

            $selection = $selectedSegments[$segId];
            if (empty($selection)) continue;

            $segTitle = $seg['title'] ?? 'Segment';

            if (isset($seg['pricing_mode']) && $seg['pricing_mode'] === 'global') {
                $list[] = $segTitle;
            } else {
                $subSegments = $seg['sub_segments'] ?? [];
                $selectedSubIds = is_array($selection) ? $selection : [$selection];

                foreach ($selectedSubIds as $subId) {
                    $sub = collect($subSegments)->firstWhere('id', $subId);
                    if (!$sub) continue;

                    $subTitle = $sub['title'] ?? '';

                    if (empty($sub['has_options']) || (isset($sub['pricing_mode']) && $sub['pricing_mode'] === 'global')) {
                        $list[] = $segTitle . ' -> ' . $subTitle;
                    } else {
                        $subOptions = $optionsMap[$sub['id']] ?? [];
                        $selectedOptIds = is_array($subOptions) ? $subOptions : [$subOptions];

                        foreach ($selectedOptIds as $optId) {
                            $opt = collect($sub['options'] ?? [])->firstWhere('id', $optId);
                            if (!$opt) continue;
                            $optTitle = $opt['title'] ?? '';
                            $list[] = $segTitle . ' -> ' . $subTitle . ' (' . $optTitle . ')';
                        }
                    }
                }
            }
        }

        return implode(' | ', $list);
    }
}
