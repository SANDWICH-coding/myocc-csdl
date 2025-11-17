<?php

namespace App\Http\Controllers;

use App\Models\EventSanctionSettlement;
use App\Models\Sanction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventSanctionSettlementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request): JsonResponse
    {
        // Step 1: Validate base request
        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'user_id_no' => ['required', 'string', 'max:255'],
            'sanction_id' => ['required', 'exists:sanctions,id'],
            'settlement_type' => ['required', Rule::in(['monetary', 'service'])],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'service_completed' => ['nullable', 'integer', 'min:0'],
            'service_time_type' => ['nullable', Rule::in(['minutes', 'hours'])],
            'settlement_logged_by' => ['required', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['partial', 'settled', 'waived'])],
            'remarks' => ['nullable', 'string'],
        ]);

        // Step 2: Verify sanction type consistency
        $sanction = Sanction::findOrFail($validated['sanction_id']);

        if ($sanction->sanction_type !== $validated['settlement_type']) {
            return response()->json([
                'message' => 'Invalid settlement type. It must match the sanction type ('
                    . $sanction->sanction_type . ').',
            ], 422);
        }

        // Step 3: Additional validations based on settlement_type
        if ($validated['settlement_type'] === 'monetary') {
            if (empty($validated['amount_paid'])) {
                return response()->json([
                    'message' => 'The amount_paid field is required for monetary settlements.',
                ], 422);
            }
        }

        if ($validated['settlement_type'] === 'service') {
            if (empty($validated['service_completed']) || empty($validated['service_time_type'])) {
                return response()->json([
                    'message' => 'The service_completed and service_time_type fields are required for service settlements.',
                ], 422);
            }
        }

        // Step 4: Create settlement record
        $settlement = EventSanctionSettlement::create([
            'event_id' => $validated['event_id'],
            'user_id_no' => $validated['user_id_no'],
            'sanction_id' => $validated['sanction_id'],
            'settlement_type' => $validated['settlement_type'],
            'amount_paid' => $validated['amount_paid'] ?? null,
            'service_completed' => $validated['service_completed'] ?? null,
            'service_time_type' => $validated['service_time_type'] ?? null,
            'settlement_logged_by' => $validated['settlement_logged_by'],
            'status' => $validated['status'] ?? 'partial',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json([
            'message' => 'Sanction settlement recorded successfully.',
            'data' => $settlement,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EventSanctionSettlement $eventSanctionSettlement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EventSanctionSettlement $eventSanctionSettlement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EventSanctionSettlement $eventSanctionSettlement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventSanctionSettlement $eventSanctionSettlement)
    {
        //
    }
}
