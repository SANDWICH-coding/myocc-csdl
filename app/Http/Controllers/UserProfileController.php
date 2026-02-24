<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserInformation;
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

        // Build avatar from users table
        $avatar = $user->profile_photo
            ? Storage::disk('public')->url($user->profile_photo) . '?t=' . time()
            : null;

        $studentData = null;
        $userInfoData = null;

        if ($user->user_role === 'student') {

            $studentData = $this->fetchStudentData($user->user_id_no, $sisApi);

        } else {

            $userInfoData = UserInformation::where('user_id_no', $user->user_id_no)
                ->select([
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email_address',
                ])
                ->first();

            // If user table has no avatar, fallback to user_information
            if ($userInfoData && !$avatar && $userInfoData->profile_photo) {
                $avatar = Storage::disk('public')->url($userInfoData->profile_photo) . '?t=' . time();
            }
        }

        return Inertia::render('Profile/Index', [
            'studentData' => $studentData,
            'userInfoData' => $userInfoData,
            'avatar' => $avatar,
        ]);
    }


    private function fetchStudentData($userIdNo, SisApiService $sisApi)
    {
        $query = http_build_query([
            'user_id_no' => [$userIdNo]
        ]);

        $response = $sisApi->get("/api/student-enrollment?{$query}");

        if (!$response->ok()) {
            return null;
        }

        $student = collect($response->json())->first();

        if (!$student) {
            return null;
        }

        return [
            'first_name' => $student['first_name'] ?? null,
            'middle_name' => $student['middle_name'] ?? null,
            'last_name' => $student['last_name'] ?? null,
            'gender' => $student['gender'] ?? null,
            'birthday' => $student['birthday'] ?? null,
            'email_address' => $student['email_address'] ?? null,
            'contact_number' => $student['contact_number'] ?? null,
            'present_address' => $student['present_address'] ?? null,
            'zip_code' => $student['zip_code'] ?? null,
        ];
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:5120',
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
