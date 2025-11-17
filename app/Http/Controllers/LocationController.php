<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class LocationController extends Controller
{

    public function index()
    {
        $locations = Location::where('status', 1)->get();
        return response()->json(['data' => $locations], 200);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if (isset($data['polygon_points']) && is_string($data['polygon_points'])) {
            $data['polygon_points'] = json_decode($data['polygon_points'], true);
        }

        $validator = Validator::make($data, [
            'location_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'polygon_points' => 'required|array|min:3',
            'polygon_points.*.lng' => 'required|numeric|between:-180,180',
            'polygon_points.*.lat' => 'required|numeric|between:-90,90',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('location_photo') && $request->file('location_photo')->isValid()) {
            $photoPath = $request->file('location_photo')->store('locations', 'public');
        }

        $location = Location::create([
            'location_name' => $data['location_name'],
            'address' => $data['address'],
            'polygon_points' => $data['polygon_points'],
            'status' => $data['status'] ?? 1,
        ]);

        return response()->json(['data' => $location, 'message' => 'Location created successfully'], 200);
    }


    public function show(Location $location)
    {
        if ($location->status != 1) {
            return response()->json(['message' => 'Location not found'], 404);
        }
        return response()->json(['data' => $location], 200);
    }

    public function update(Request $request, Location $location)
    {
        if ($location->status != 1) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'location_name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'polygon_points' => 'sometimes|required|array|min:3',
            'polygon_points.*.lng' => 'required|numeric|between:-180,180',
            'polygon_points.*.lat' => 'required|numeric|between:-90,90',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $location->update($request->only([
            'location_name',
            'address',
            'polygon_points',
            'status'
        ]));

        return response()->json(['data' => $location, 'message' => 'Location updated successfully'], 200);
    }

    public function destroy(Location $location)
    {
        if ($location->status != 1) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $location->update(['status' => 0]);
        return response()->json(['message' => 'Location deleted successfully'], 200);
    }
}
