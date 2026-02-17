<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\UserViolationRecord;
use App\Models\Violation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViolationController extends Controller
{
    public function index(Request $request)
    {
        $violations = UserViolationRecord::with(['sanction', 'issuer'])
            ->where('user_id', auth()->id())
            ->latest('issued_date_time')
            ->paginate(10)
            ->withQueryString();

        // Transform paginated collection
        $violations->getCollection()->transform(function ($record) {

            // Get violation IDs from JSON column
            $violationIds = $record->violation_ids ?? [];

            // Fetch violation codes
            $violationCodes = Violation::whereIn('id', $violationIds)
                ->pluck('violation_code');

            // Attach to record
            $record->violation_codes = $violationCodes;

            return $record;
        });

        return Inertia::render('Student/Violation/Index', [
            'violations' => $violations,
            'filters' => $request->only('search'),
        ]);
    }

}
