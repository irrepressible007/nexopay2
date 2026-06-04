<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $metrics = [
            'total_events' => Event::count(),
            'pending_registrations' => Registration::where('status', 'pending')->count(),
            'approved_registrations' => Registration::where('status', 'approved')->count(),
            'total_users' => User::count(),
        ];
        
        $settings = DB::table('site_settings')->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
            'siteSettings' => $settings
        ]);
    }
    
    public function updateSettings(Request $request)
    {
        $request->validate([
            'primary_color' => 'required|string',
        ]);
        
        DB::table('site_settings')->updateOrInsert(
            ['key' => 'primary_color'],
            ['value' => $request->primary_color]
        );
        
        return redirect()->back()->with('success', 'Theme settings updated!');
    }
}
