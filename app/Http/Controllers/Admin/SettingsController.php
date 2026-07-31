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
        $validated = $request->validate([
            'app_name' => 'nullable|string',
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'footer_text' => 'nullable|string',
            'footer_links' => 'nullable|array',
            'contact_subtitle' => 'nullable|string',
            'contact_address' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'meta_pixel_id' => 'nullable|string',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'navbar_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $data = collect($validated)->except(['hero_image', 'navbar_logo'])->toArray();

        // Handle file uploads
        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('public/settings');
            $data['hero_image'] = Storage::url($path);
        }

        if ($request->hasFile('navbar_logo')) {
            $path = $request->file('navbar_logo')->store('public/settings');
            $data['navbar_logo'] = Storage::url($path);
        }

        // Loop through and update each setting safely
        foreach ($data as $key => $value) {
            if ($value !== null) {
                // Mitigate Stored XSS by stripping dangerous tags like <script>
                if (is_string($value) && in_array($key, ['footer_text', 'contact_subtitle'])) {
                    $value = strip_tags($value, '<b><strong><i><em><u><p><br><a><ul><li><ol><h1><h2><h3><h4><h5><h6><span><div><style><blockquote><hr>');
                }

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
