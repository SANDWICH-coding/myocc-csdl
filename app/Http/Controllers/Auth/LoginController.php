<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SisApiService;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function show()
    {
        // If user is already logged in, redirect them based on their role
        if (Auth::check()) {
            return $this->redirectBasedOnRole();
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'user_id_no' => 'required',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('user_id_no', 'password'), true)) {
            return back()->withErrors([
                'error' => 'Invalid login credentials',
            ]);
        }

        $request->session()->regenerate();

        // Redirect the user based on their role after successful login
        return $this->redirectBasedOnRole();
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }

    /**
     * Redirect the user to the appropriate route based on their role.
     */
    private function redirectBasedOnRole()
    {
        return match (auth()->user()->user_role) {
            'admin' => Inertia::location(route('admin.dashboard')),
            'security' => Inertia::location(route('security.dashboard')),
            'student' => Inertia::location(route('student.dashboard')),
            default => Inertia::location('/'), // Redirect to home or other fallback route
        };
    }

    public function registerShowForm()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole();
        }

        return Inertia::render('Auth/Register');
    }


    public function register(Request $request, SisApiService $sisApi)
    {
        $validated = $request->validate([
            'user_id_no' => 'required|string',
            'last_name' => 'required|string',
            'birthdate' => ['required', 'date', 'before_or_equal:today'],
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $students = $this->fetchStudentData($request->user_id_no, $sisApi);

        if ($students->isEmpty()) {
            return back()->withErrors([
                'user_id_no' => 'ID number not found in the system.'
            ])->withInput();
        }

        $student = $students->first();

        if (!$student) {
            return back()->withErrors([
                'user_id_no' => 'Student not found in the system.'
            ])->withInput();
        }

        // Normalize values
        $inputLastName = strtoupper(trim($request->last_name));
        $apiLastName = strtoupper(trim($student['last_name'] ?? ''));

        $inputEmail = strtolower(trim($request->email));
        $apiEmail = strtolower(trim($student['email_address'] ?? ''));

        // Normalize birthdates safely
        try {
            $inputBirthdate = Carbon::parse($request->birthdate)->format('Y-m-d');
            $apiBirthdate = isset($student['birthday'])
                ? Carbon::parse($student['birthday'])->format('Y-m-d')
                : null;
        } catch (\Exception $e) {
            return back()->withErrors([
                'birthdate' => 'Invalid birthdate format.'
            ])->withInput();
        }

        // Comparisons
        if ($inputLastName !== $apiLastName) {
            return back()->withErrors([
                'last_name' => 'Last name does not match our records.'
            ])->withInput();
        }

        if (!$apiBirthdate || $inputBirthdate !== $apiBirthdate) {
            return back()->withErrors([
                'birthdate' => 'Birthdate does not match our records.'
            ])->withInput();
        }

        if ($inputEmail !== $apiEmail) {
            return back()->withErrors([
                'email' => 'Email does not match our records.'
            ])->withInput();
        }

        // Check if currently enrolled
        $enrolledCurrent = collect($student['enrolled_students'] ?? [])
            ->contains(function ($enroll) {
                return ($enroll['year_section']['school_year']['is_current'] ?? 0) == 1;
            });

        if (!$enrolledCurrent) {
            return back()->withErrors([
                'user_id_no' => 'Student is not enrolled in the current school year.'
            ])->withInput();
        }

        try {
            $user = User::create([
                'user_id_no' => $student['user_id_no'],
                'user_role' => 'student',
                'password' => Hash::make($request->password),
                'email' => $request->email,
                'profile_photo' => null,
                'face_enrolled' => 0,
            ]);
        } catch (QueryException $e) {

            if ($e->getCode() === '23000') {
                return back()->withErrors([
                    'user_id_no' => 'This ID Number is already registered.'
                ])->withInput();
            }

            return back()->withErrors([
                'user_id_no' => 'Something went wrong. Please try again.'
            ])->withInput();
        }

        auth()->login($user);

        return redirect()->route('student.dashboard');
    }


    private function fetchStudentData($userIdNo, SisApiService $sisApi)
    {
        $query = http_build_query(['user_id_no' => [$userIdNo]]);

        $response = $sisApi->get("/api/student-enrollment?{$query}");

        if (!$response->ok()) {
            return collect();
        }

        return collect($response->json());
    }

}
