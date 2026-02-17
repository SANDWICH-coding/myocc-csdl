<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SisApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function index(SisApiService $sisApi)
    {
        $user = auth()->user();

        // Always build avatar
        $avatar = $user->profile_photo
            ? Storage::disk('public')->url($user->profile_photo) . '?t=' . time()
            : null;

        $studentData = null;
        $userInfoData = null;

        if ($user->user_role === 'student') {
            $data = $this->fetchStudentData($user->user_id_no, $sisApi);
            $studentData = $data?->first();
        } else {
            // Fetch non-student user information
            $userInfoData = \App\Models\UserInformation::where('user_id_no', $user->user_id_no)->first();

            if ($userInfoData && !$avatar && $userInfoData->profile_photo) {
                // Use the profile photo from user_information if user doesn't have one
                $avatar = Storage::disk('public')->url($userInfoData->profile_photo) . '?t=' . time();
            }
        }

        return Inertia::render('Profile/Index', [
            'studentData' => $studentData,
            'userInfoData' => $userInfoData,
            'avatar' => $avatar,
        ]);
    }


    private function fetchStudentData($userIdNos, SisApiService $sisApi)
    {
        $query = http_build_query([
            'user_id_no' => (array) $userIdNos
        ]);

        $response = $sisApi->get("/api/student-enrollment?{$query}");

        if (!$response->ok()) {
            return null;
        }

        return collect($response->json())->map(function ($student) {

            if (!isset($student['user_id_no'])) {
                return $student;
            }

            $user = User::where('user_id_no', $student['user_id_no'])->first();

            $student['avatar'] = $user && $user->profile_photo
                ? Storage::disk('public')->url($user->profile_photo) . '?t=' . time()
                : null;

            return $student;
        });
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = auth()->user();

        // Delete old photo if exists
        if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        // Store new photo
        $path = $request->file('avatar')->store('profile-photos', 'public');

        $user->update([
            'profile_photo' => $path,
        ]);

        return back();
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = auth()->user();
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }


}
