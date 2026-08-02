<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240', // 10MB max
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');

                try {
                    $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                    $directory = storage_path('app/public/quill');

                    if (!file_exists($directory)) {
                        mkdir($directory, 0755, true);
                    }

                    $filename = uniqid() . '.webp';
                    $manager->read($file->getRealPath())->toWebp(80)->save($directory . '/' . $filename);

                    return response()->json([
                        'url' => '/storage/quill/' . $filename
                    ]);
                } catch (\Throwable $e) {
                    // Fallback to standard Laravel storage if Intervention fails
                    $path = $file->store('quill', 'public');
                    return response()->json([
                        'url' => Storage::url($path)
                    ]);
                }
            }

            return response()->json(['error' => 'No image file uploaded'], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            Log::error('Rich text image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'Image upload failed: ' . $e->getMessage()], 500);
        }
    }
}
