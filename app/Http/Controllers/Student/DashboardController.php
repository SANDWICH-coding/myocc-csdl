<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\UserViolationRecord;

class DashboardController extends Controller
{
    public function index(Request $request)
    {

        $unsettledCount = UserViolationRecord::where('user_id', Auth::id())
            ->where('status', 'unsettled')
            ->count();

        return Inertia::render('Student/Dashboard', [
            'unsettledCount' => $unsettledCount,
        ]);

    }
}
