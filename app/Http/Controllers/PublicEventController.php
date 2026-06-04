<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Role;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class PublicEventController extends Controller
{
    public function index()
    {
        $events = Event::where('status', 'upcoming')
            ->latest()
            ->take(3)
            ->get();

        $partners = \App\Models\Partner::where('is_active', true)->latest()->get();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'events' => $events,
            'partners' => $partners,
        ]);
    }

    public function eventsIndex()
    {
        $events = Event::where('status', 'upcoming')
            ->latest()
            ->paginate(12);

        return Inertia::render('Events/PublicIndex', [
            'events' => $events,
        ]);
    }

    public function show(Event $event)
    {
        if ($event->status === 'draft') {
            abort(404);
        }

        return Inertia::render('Events/Show', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'event' => $event,
        ]);
    }

    public function register(Request $request, Event $event)
    {
        $request->validate([
            'role' => 'required|string',
            'bkash_txid' => 'required|string|unique:registrations,bkash_txid',
            'form_data' => 'nullable|array',
            'selected_segments' => 'nullable|array',
        ]);

        $role = Role::firstOrCreate([
            'name' => $request->role,
            'slug' => strtolower(str_replace(' ', '-', $request->role))
        ]);

        // Secure Server-side Price Calculation
        $total = 0;
        
        if ($event->has_base_price) {
            $base_prices = [
                'Participant' => $event->participant_price,
                'Campus Ambassador' => $event->ca_price,
                'Volunteer' => $event->volunteer_price,
            ];
            $total += $base_prices[$request->role] ?? 0;
        }

        $selectedSegments = $request->selected_segments ?? [];
        $eventSegments = $event->segments ?? [];

        foreach ($eventSegments as $seg) {
            if (!isset($selectedSegments[$seg['id']])) {
                continue;
            }

            $selection = $selectedSegments[$seg['id']];

            if (isset($seg['pricing_mode']) && $seg['pricing_mode'] === 'global') {
                if ($selection === true) {
                    $total += (float) ($seg['global_price'] ?? 0);
                }
            } else {
                if (is_array($selection)) {
                    foreach ($selection as $subId) {
                        $sub = collect($seg['sub_segments'] ?? [])->firstWhere('id', $subId);
                        if ($sub) {
                            $total += (float) ($sub['price'] ?? 0);
                        }
                    }
                } else {
                    $sub = collect($seg['sub_segments'] ?? [])->firstWhere('id', $selection);
                    if ($sub) {
                        $total += (float) ($sub['price'] ?? 0);
                    }
                }
            }
        }

        // Smart auto-fill logic
        $user = auth()->user();
        $updatedProfile = array_merge((array) $user->profile_data, (array) $request->form_data);
        $user->update(['profile_data' => $updatedProfile]);

        Registration::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'role_id' => $role->id,
            'bkash_txid' => $request->bkash_txid,
            'status' => 'pending',
            'form_data' => $request->form_data,
            'selected_segments' => $selectedSegments,
            'payable_amount' => $total,
        ]);

        return redirect()->route('dashboard')->with('success', 'Registration submitted and pending Finance approval.');
    }
}
