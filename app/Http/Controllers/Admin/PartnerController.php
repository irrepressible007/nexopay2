<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::latest()->get();
        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'logo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo_image')) {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $directory = storage_path('app/public/partners');
            
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $filename = uniqid() . '.webp';
            $manager->read($request->file('logo_image')->getRealPath())->toWebp(80)->save($directory . '/' . $filename);
            $validated['logo_image'] = '/storage/partners/' . $filename;
        }

        Partner::create($validated);

        return redirect()->back()->with('success', 'Partner added successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'logo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo_image')) {
            // Delete old if exists
            if ($partner->logo_image) {
                $oldPath = str_replace('/storage/', '', $partner->logo_image);
                Storage::disk('public')->delete($oldPath);
            }
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $directory = storage_path('app/public/partners');
            
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $filename = uniqid() . '.webp';
            $manager->read($request->file('logo_image')->getRealPath())->toWebp(80)->save($directory . '/' . $filename);
            $validated['logo_image'] = '/storage/partners/' . $filename;
        }

        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        if ($partner->logo_image) {
            $oldPath = str_replace('/storage/', '', $partner->logo_image);
            Storage::disk('public')->delete($oldPath);
        }
        $partner->delete();
        
        return redirect()->back()->with('success', 'Partner deleted successfully.');
    }
}
