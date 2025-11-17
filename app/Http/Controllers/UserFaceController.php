<?php

namespace App\Http\Controllers;

use App\Models\UserFace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserFaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userFaces = UserFace::all();

        return response()->json([
            'user_faces' => $userFaces,
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id_no' => 'required|string|exists:users,user_id_no',
            'user_face_embeddings' => 'required|array',
            'user_face_embeddings.*' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // Start a database transaction to ensure atomicity
        DB::transaction(function () use ($validated) {
            // Store face embeddings
            UserFace::create([
                'user_id_no' => $validated['user_id_no'],
                'user_face_embeddings' => $validated['user_face_embeddings'],
            ]);

            // Update face_enrolled = 1 in users table
            DB::table('users')
                ->where('user_id_no', $validated['user_id_no'])
                ->update(['face_enrolled' => 1]);
        });

        return response()->json([
            'success' => true,
            'message' => 'User Face stored and enrollment status updated successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserFace $userFace)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserFace $userFace)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserFace $userFace)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserFace $userFace)
    {
        //
    }
}
