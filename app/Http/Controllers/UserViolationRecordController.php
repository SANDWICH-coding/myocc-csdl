<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sanction;
use App\Models\User;
use App\Models\UserViolationRecord;
use App\Models\Violation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Validator;

class UserViolationRecordController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id_no' => 'required|exists:users,user_id_no',
            'violations' => 'required|array|min:1',
            'violations.*' => 'integer',
            'sanction_id' => 'nullable|integer',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid input',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('user_id_no', $request->user_id_no)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $sanctionId = $request->sanction_id;

        if (!$sanctionId) {
            $defaultSanction = Sanction::where('is_default', 1)->first();
            $sanctionId = $defaultSanction?->id; // will be null if none exists
        }

        $record = UserViolationRecord::create([
            'reference_no' => $this->generateReferenceNumber(),
            'user_id' => $user->id,
            'violation_ids' => $request->violations,
            'sanction_id' => $sanctionId, // <-- uses default if available
            'issued_by' => Auth::id(),
            'issued_date_time' => now(),
            'remarks' => $request->remarks ?? null,
            'status' => 'unsettled',
        ]);

        // Load relationships
        $record->load('user', 'sanction');

        // Fetch violation codes
        $violations = Violation::whereIn('id', $record->violation_ids)
            ->pluck('violation_code');

        $record->violation_codes = $violations;

        return response()->json([
            'message' => 'Violation record created successfully',
            'record' => $record,
        ], 201);
    }

    private function generateReferenceNumber()
    {
        do {
            $reference = str_pad(mt_rand(0, 99999999999), 11, '0', STR_PAD_LEFT);
        } while (UserViolationRecord::where('reference_no', $reference)->exists());

        return $reference;
    }


    public function userViolationRecordsIndex(Request $request)
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

    public function allUserViolationRecordsIndex(Request $request)
    {
        $search = $request->search;

        $violations = UserViolationRecord::query()
            ->select([
                'id',
                'reference_no',
                'user_id',
                'sanction_id',
                'issued_by',
                'status',
                'issued_date_time',
                'violation_ids',
            ])
            ->with([
                'user:id,user_id_no',
                'issuer:id,user_id_no',
                'sanction:id,sanction_type,monetary_amount,service_time,service_time_type,sanction_name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where('reference_no', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('user_id_no', 'like', "%{$search}%");
                    });
            })
            ->latest('issued_date_time')
            ->paginate(10)
            ->withQueryString();

        /**
         * Collect all violation IDs from current page
         */
        $allViolationIds = collect($violations->items())
            ->pluck('violation_ids')
            ->flatten()
            ->unique()
            ->filter()
            ->values();

        /**
         * Fetch only needed violation codes
         */
        $violationMap = Violation::whereIn('id', $allViolationIds)
            ->pluck('violation_code', 'id');

        /**
         * Transform data (Clean API-style response)
         */
        $violations->getCollection()->transform(function ($record) use ($violationMap) {

            return [
                'id' => $record->id,
                'reference_no' => $record->reference_no,
                'issued_date_time' => $record->issued_date_time,
                'status' => $record->status,

                'user' => [
                    'user_id_no' => $record->user?->user_id_no,
                ],

                'issuer' => [
                    'user_id_no' => $record->issuer?->user_id_no,
                ],

                'sanction' => $record->sanction ? [
                    'sanction_type' => $record->sanction->sanction_type,
                    'monetary_amount' => $record->sanction->monetary_amount,
                    'service_time' => $record->sanction->service_time,
                    'service_time_type' => $record->sanction->service_time_type,
                    'sanction_name' => $record->sanction->sanction_name,
                ] : null,

                'violation_codes' => collect($record->violation_ids)
                    ->map(fn($id) => $violationMap[$id] ?? null)
                    ->filter()
                    ->values(),
            ];
        });

        return Inertia::render('Admin/UserViolationRecords/Index', [
            'violations' => $violations,
            'filters' => $request->only('search'),
        ]);
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:unsettled,settled,void',
        ]);

        $violation = UserViolationRecord::with(['user', 'sanction', 'issuer'])->findOrFail($id);

        $violation->status = $request->status;
        $violation->save();

        $violation->violation_codes = Violation::whereIn('id', $violation->violation_ids)
            ->pluck('violation_code');

        return response()->json([
            'record' => $violation,
            'message' => 'Status updated successfully',
        ]);
    }

    public function printUnsettled()
    {
        $user = auth()->user();

        $violations = UserViolationRecord::with(['sanction', 'issuer'])
            ->where('user_id', $user->id)
            ->where('status', 'unsettled')
            ->latest('issued_date_time')
            ->get();

        $violations->transform(function ($record) {
            $violationIds = $record->violation_ids ?? [];

            $record->violation_codes = Violation::whereIn('id', $violationIds)
                ->pluck('violation_code');

            return $record;
        });

        $pdf = Pdf::loadView('pdf.student-unsettled-violations', [
            'violations' => $violations,
            'user' => $user,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('unsettled-violations.pdf');
    }

}
