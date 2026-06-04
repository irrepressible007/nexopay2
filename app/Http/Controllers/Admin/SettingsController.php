<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = DB::table('site_settings')->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'siteSettings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['_token', 'hero_image', 'navbar_logo']);

        // Handle file uploads
        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('public/settings');
            $data['hero_image'] = Storage::url($path);
        }

        if ($request->hasFile('navbar_logo')) {
            $path = $request->file('navbar_logo')->store('public/settings');
            $data['navbar_logo'] = Storage::url($path);
        }

        // Loop through and update each setting
        foreach ($data as $key => $value) {
            if ($value !== null) {
                // If it's an array (like footer_links), encode it
                if (is_array($value)) {
                    $value = json_encode($value);
                }
                
                DB::table('site_settings')->updateOrInsert(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        return redirect()->back()->with('success', 'Site settings updated successfully!');
    }
}
