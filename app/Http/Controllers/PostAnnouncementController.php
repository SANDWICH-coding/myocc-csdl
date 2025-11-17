<?php

namespace App\Http\Controllers;

use App\Models\PostAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PostAnnouncementController extends Controller
{
    /**
     * Display a listing of active announcements (status = 1).
     */
    public function index()
    {
        $announcements = PostAnnouncement::where('status', 1)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($announcements);
    }

    /**
     * Store a newly created post announcement.
     */
    public function store(Request $request)
    {
        // Must be authenticated
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'privacy_id' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'boolean',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('post_photos', 'public');
        }

        $announcement = PostAnnouncement::create([
            'author_id' => $userId, // Authenticated user ID (must exist in users)
            'privacy_id' => $validated['privacy_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'post_photo' => $photoPath,
            'status' => $validated['status'] ?? true,
        ]);

        return response()->json([
            'message' => 'Post announcement created successfully.',
            'data' => $announcement,
        ], 201);
    }

    /**
     * Update the specified post announcement.
     */
    public function update(Request $request, PostAnnouncement $postAnnouncement)
    {
        $validated = $request->validate([
            'privacy_id' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'boolean',
        ]);

        // Handle photo update if a new one is uploaded
        if ($request->hasFile('photo')) {
            if ($postAnnouncement->post_photo) {
                Storage::disk('public')->delete($postAnnouncement->post_photo);
            }
            $postAnnouncement->post_photo = $request->file('photo')->store('post_photos', 'public');
        }

        $postAnnouncement->update([
            'privacy_id' => $validated['privacy_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => $validated['status'] ?? $postAnnouncement->status,
        ]);

        return response()->json([
            'message' => 'Post announcement updated successfully.',
            'data' => $postAnnouncement,
        ]);
    }

    /**
     * Soft delete (set status = 0) for the specified announcement.
     */
    public function destroy(PostAnnouncement $postAnnouncement)
    {
        $postAnnouncement->update(['status' => 0]);

        return response()->json([
            'message' => 'Post announcement has been deactivated.',
        ]);
    }
}
