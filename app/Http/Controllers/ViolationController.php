<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    // Fetch only active violations
    public function index()
    {
        $violations = Violation::where('status', 1)->get();
        return response()->json([
            'message' => 'Active violations retrieved successfully',
            'violations' => $violations
        ]);
    }

    // Store new violation with validation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'violation_code' => 'required|string|max:255|unique:violations,violation_code',
            'violation_description' => 'required|string|max:255',
        ]);

        $violation = Violation::create([
            'violation_code' => $validated['violation_code'],
            'violation_description' => $validated['violation_description'],
            'status' => 1, // active by default
        ]);

        return response()->json([
            'message' => 'Violation created successfully',
            'violation' => $violation
        ], 201);
    }

    // Update only the description
    public function update(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'violation_description' => 'required|string|max:255',
        ]);

        $violation->violation_description = $validated['violation_description'];
        $violation->save();

        return response()->json([
            'message' => 'Violation description updated successfully',
            'violation' => $violation
        ]);
    }

    // Soft delete: set status to 0
    public function destroy(Violation $violation)
    {
        $violation->status = 0;
        $violation->save();

        return response()->json([
            'message' => 'Violation deactivated successfully'
        ]);
    }
}
