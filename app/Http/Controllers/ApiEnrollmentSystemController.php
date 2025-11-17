<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class ApiEnrollmentSystemController extends Controller
{
    public function fetchSchoolYears()
    {
        $apiToken = env('API_ENROLLMENT_SYSTEM_TOKEN');
        $apiUrl = env('API_ENROLLMENT_SYSTEM_URL');

        if (!$apiToken || !$apiUrl) {
            return ['error' => 'API configuration is missing'];
        }

        $schoolYears = Http::withToken(env('API_ENROLLMENT_SYSTEM_TOKEN'))
            ->get(env('API_ENROLLMENT_SYSTEM_URL') . '/api/school-years');

        if ($schoolYears->successful()) {
            return $schoolYears->json();
        }

        return ['error' => 'Unauthorized or failed'];
    }

    public function fetchEnrolledStudents(Request $request)
    {
        $apiToken = env('API_ENROLLMENT_SYSTEM_TOKEN');
        $apiUrl = env('API_ENROLLMENT_SYSTEM_URL');

        if (!$apiToken || !$apiUrl) {
            return response()->json(['error' => 'API configuration is missing'], 500);
        }

        $response = Http::withToken($apiToken)->get("{$apiUrl}/api/enrolled-students");

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch enrolled students from API'], 500);
        }

        $payload = $response->json();

        if (!isset($payload['courses']) || !is_array($payload['courses'])) {
            return response()->json(['error' => 'Invalid API response format'], 500);
        }

        $coursesData = collect($payload['courses']);

        // Filters from request
        $filterCourse = $request->input('course', 'all');
        $filterYearLevel = $request->input('year_level', 'all');
        $filterSection = $request->input('section', 'all');
        $filterRegistered = $request->input('registered_in_system', 'all'); // all|registered|not_registered
        $filterFace = $request->input('face_enrolled', 'all'); // all|enrolled|not_enrolled

        $page = max(1, (int) $request->input('page', 1));
        $perPage = max(1, (int) $request->input('per_page', 20));

        // Flatten all students for DB checks
        $allApiStudents = collect();
        $flatStudents = collect();

        foreach ($coursesData as $courseName => $course) {
            foreach ($course['year_levels'] as $yearLevel) {
                foreach ($yearLevel['sections'] as $section) {
                    foreach ($section['students'] as $student) {
                        $allApiStudents->push($student['id_no'] ?? null);
                        $flatStudents->push(array_merge($student, [
                            'course' => $course['course_abbreviation'],
                            'year_level' => $yearLevel['year_level_name'],
                            'section' => $section['section_name'] ?? '',
                        ]));
                    }
                }
            }
        }

        // Fetch local students to annotate face_enrolled & registration
        $localStudents = User::where('user_role', 'student')
            ->whereIn('user_id_no', $allApiStudents->unique()->values()->toArray())
            ->get(['user_id_no', 'face_enrolled']);

        $localStudentMap = $localStudents->keyBy('user_id_no');

        // Annotate students
        $allExistCount = $allNotExistCount = $allFaceCount = 0;

        $annotatedFlat = $flatStudents->map(function ($student) use ($localStudentMap, &$allExistCount, &$allNotExistCount, &$allFaceCount) {
            $idNo = $student['id_no'] ?? null;
            $isRegistered = $idNo ? $localStudentMap->has($idNo) : false;
            $isFace = $isRegistered ? (bool) $localStudentMap[$idNo]->face_enrolled : false;

            if ($isRegistered) {
                $allExistCount++;
                if ($isFace)
                    $allFaceCount++;
            } else {
                $allNotExistCount++;
            }

            $student['is_registered_in_system'] = $isRegistered;
            $student['is_face_enrolled'] = $isFace;
            return $student;
        });

        // Apply filters
        $filteredFlat = $annotatedFlat->filter(function ($student) use ($filterCourse, $filterYearLevel, $filterSection, $filterRegistered, $filterFace) {
            if ($filterCourse !== 'all' && $student['course'] !== $filterCourse)
                return false;
            if ($filterYearLevel !== 'all' && $student['year_level'] !== $filterYearLevel)
                return false;
            if ($filterSection !== 'all' && $student['section'] !== $filterSection)
                return false;
            if ($filterRegistered === 'registered' && !$student['is_registered_in_system'])
                return false;
            if ($filterRegistered === 'not_registered' && $student['is_registered_in_system'])
                return false;
            if ($filterFace === 'enrolled' && !$student['is_face_enrolled'])
                return false;
            if ($filterFace === 'not_enrolled' && $student['is_face_enrolled'])
                return false;
            return true;
        })->values();

        // Rebuild hierarchical format for frontend
        $hierarchical = $filteredFlat
            ->groupBy('course')
            ->map(function ($courseStudents, $courseName) {
                return [
                    'course_abbreviation' => $courseName,
                    'year_levels' => $courseStudents
                        ->groupBy('year_level')
                        ->map(function ($yearLevelStudents, $yearLevelName) {
                            return [
                                'year_level_name' => $yearLevelName,
                                'sections' => $yearLevelStudents
                                    ->groupBy('section')
                                    ->map(function ($sectionStudents, $sectionName) {
                                        return [
                                            'section_name' => $sectionName,
                                            'students' => $sectionStudents->values(),
                                        ];
                                    })->values(),
                            ];
                        })->values(),
                ];
            })->values();

        // Paginate the flat list
        $total = $filteredFlat->count();
        $paginated = $filteredFlat->forPage($page, $perPage)->values();

        return response()->json([
            'school_year' => $payload['school_year'] ?? null,
            'selected_filters' => [
                'course' => $filterCourse,
                'year_level' => $filterYearLevel,
                'section' => $filterSection,
                'registered_in_system' => $filterRegistered,
                'face_enrolled' => $filterFace,
            ],
            'hierarchical_data' => $hierarchical,
            'filtered_data' => $paginated->all(),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'has_more' => $total > ($page * $perPage),
            ],
            'count_summary' => [
                'overall' => [
                    'total_students' => $allApiStudents->count(),
                    'registered_in_system' => $allExistCount,
                    'face_enrolled' => $allFaceCount,
                    'not_registered' => $allNotExistCount,
                ],
                'after_filter' => [
                    'total_students' => $filteredFlat->count(),
                    'registered_in_system' => $filteredFlat->where('is_registered_in_system', true)->count(),
                    'face_enrolled' => $filteredFlat->where('is_face_enrolled', true)->count(),
                    'not_registered' => $filteredFlat->where('is_registered_in_system', false)->count(),
                ],
            ],
        ], 200);
    }

}
