<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserViolationRecord;
use App\Models\Violation;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $totalUsers = User::count();
        $unsettledViolations = UserViolationRecord::where('status', 'unsettled')->count();

        // Get all active violations
        $violations = Violation::where('status', true)->get();

        // Initialize counts array using violation_code as key
        $violationCounts = [];

        foreach ($violations as $violation) {
            $violationCounts[$violation->violation_code] = 0;
        }

        // Get all violation records
        $records = UserViolationRecord::all();

        foreach ($records as $record) {
            if (!is_array($record->violation_ids)) {
                continue;
            }

            foreach ($record->violation_ids as $violationId) {

                $violation = $violations->firstWhere('id', $violationId);

                if ($violation) {
                    $code = $violation->violation_code;
                    $violationCounts[$code]++;
                }
            }
        }

        // Convert to chart-friendly format
        $violationChartData = collect($violationCounts)->map(function ($count, $code) {
            return [
                'violation_code' => $code,
                'count' => $count,
            ];
        })->values();

        return Inertia::render('Admin/Dashboard', [
            'totalUsers' => $totalUsers,
            'unsettledViolations' => $unsettledViolations,
            'violationChartData' => $violationChartData,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
