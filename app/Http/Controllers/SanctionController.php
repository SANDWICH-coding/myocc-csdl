<?php

namespace App\Http\Controllers;

use App\Models\Sanction;
use Illuminate\Http\Request;

class SanctionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sanctions = Sanction::where('status', 1)->get();

        return response()->json([
            'message' => 'Active sanctions retrieved successfully',
            'sanctions' => $sanctions
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sanction_type' => 'required|in:monetary,service',
            'sanction_name' => 'required|string|max:255',
            'sanction_description' => 'nullable|string',
            'monetary_amount' => 'nullable|numeric|min:0|required_if:sanction_type,monetary',
            'service_time' => 'nullable|numeric|min:0|required_if:sanction_type,service',
            'service_time_type' => 'nullable|in:minutes,hours|required_if:sanction_type,service',
            'status' => 'boolean'
        ]);

        // Convert sanction_name to uppercase
        $validated['sanction_name'] = strtoupper($validated['sanction_name']);

        $sanction = Sanction::create($validated);

        return response()->json([
            'message' => 'Sanction created successfully',
            'sanction' => $sanction
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sanction $sanction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Sanction $sanction)
    {
        $validated = $request->validate([
            'status' => 'required|boolean'
        ]);

        $sanction->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'message' => 'Sanction status updated successfully',
            'sanction' => $sanction
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sanction $sanction)
    {
        $validated = $request->validate([
            'sanction_type' => 'sometimes|in:monetary,service',
            'sanction_name' => 'sometimes|string|max:255',
            'sanction_description' => 'nullable|string',
            'monetary_amount' => 'nullable|numeric|min:0|required_if:sanction_type,monetary',
            'service_time' => 'nullable|numeric|min:0|required_if:sanction_type,service',
            'service_time_type' => 'nullable|in:minutes,hours|required_if:sanction_type,service',
            'status' => 'sometimes|boolean'
        ]);

        // Convert sanction_name to uppercase if provided
        if (isset($validated['sanction_name'])) {
            $validated['sanction_name'] = strtoupper($validated['sanction_name']);
        }

        $sanction->update($validated);

        return response()->json([
            'message' => 'Sanction updated successfully',
            'sanction' => $sanction
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sanction $sanction)
    {
        //
    }
}
