<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
        ]);

        if ($request->file('image')) {
            $path = $request->file('image')->store('images/quill', 'public');
            
            // Return URL formatted for Quill
            return response()->json([
                'url' => Storage::url($path)
            ]);
        }

        return response()->json(['error' => 'Image upload failed'], 400);
    }
}
