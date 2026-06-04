<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::latest()->paginate(10);
        return Inertia::render('Admin/Events/Index', [
            'events' => $events
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:draft,upcoming,ongoing,past',
            'participant_price' => 'required|numeric|min:0',
            'ca_price' => 'required|numeric|min:0',
            'volunteer_price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'form_schema' => 'nullable|array',
            'segments' => 'nullable|array',
            'has_base_price' => 'boolean',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        if ($request->hasFile('gallery_images')) {
            $images = [];
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $directory = storage_path('app/public/events/galleries');
            
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            foreach ($request->file('gallery_images') as $file) {
                $filename = uniqid() . '.webp';
                $manager->read($file->getRealPath())->toWebp(80)->save($directory . '/' . $filename);
                $images[] = '/storage/events/galleries/' . $filename;
            }
            $validated['gallery_images'] = $images;
        }

        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();

        Event::create($validated);

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event)
    {
        return Inertia::render('Admin/Events/Show', [
            'event' => $event
        ]);
    }

    public function edit(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:draft,upcoming,ongoing,past',
            'participant_price' => 'required|numeric|min:0',
            'ca_price' => 'required|numeric|min:0',
            'volunteer_price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'form_schema' => 'nullable|array',
            'segments' => 'nullable|array',
            'has_base_price' => 'boolean',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        if ($request->hasFile('gallery_images')) {
            $images = [];
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $directory = storage_path('app/public/events/galleries');
            
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            foreach ($request->file('gallery_images') as $file) {
                $filename = uniqid() . '.webp';
                $manager->read($file->getRealPath())->toWebp(80)->save($directory . '/' . $filename);
                $images[] = '/storage/events/galleries/' . $filename;
            }
            // For update, we might want to merge with existing. For simplicity, we just replace.
            $validated['gallery_images'] = $images;
        }

        $event->update($validated);

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event deleted successfully.');
    }
}
