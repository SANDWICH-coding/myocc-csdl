<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventAttendanceController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/open-app', function (Request $request) {
    $userId = $request->query('user_id_no');
    $deepLink = "myapp://login?user_id_no={$userId}";
    $playStoreUrl = "https://myocc.fun/";

    return <<<HTML
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>MyOCC App</title>
    </head>
    <body>
        <script>
            // Try to open the app
            window.location = "{$deepLink}";

            // If not installed, fallback to Play Store after 2 seconds
            setTimeout(() => {
                window.location = "{$playStoreUrl}";
            }, 2000);
        </script>
        <p>If the app doesn't open automatically, <a href="{$playStoreUrl}">click here to open Play Store</a>.</p>
    </body>
    </html>
    HTML;
});


Route::get('/test', function () {
    return response()->json(['message' => 'Hello ESP!']);
});



Route::get('/web-login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/web-login', [AuthController::class, 'loginWeb'])->name('login.post');
Route::post('/web-logout', [AuthController::class, 'logoutWeb'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

    // List of events
    Route::get('/dashboard/events', [EventController::class, 'indexWeb'])->name('dashboard.events');

    // Manage specific event
    Route::get('/dashboard/events/{id}', [EventController::class, 'showWeb'])->name('dashboard.events.show');

    Route::get('/attendance/search', [EventAttendanceController::class, 'showMyEventAttendanceWeb'])
        ->name('attendance.search');


    Route::get('/qr-scanner', function () {
        return view('qr-scanner');
    })->name('qr.scanner');
});

view()->composer('*', function ($view) {
    $apkPath = storage_path('app/public/apk');
    $latestApk = null;
    $version = 'Latest';

    if (is_dir($apkPath)) {
        $files = File::files($apkPath);
        // Sort by modified time DESC and get the newest one
        usort($files, fn($a, $b) => $b->getMTime() <=> $a->getMTime());
        $latestApk = $files[0] ?? null;

        if ($latestApk) {
            // Extract version from filename (supports: myOCC-v1.2.3.apk, app-v9.0.apk, etc.)
            if (preg_match('/[vV]?([\d\.]+)\.apk$/i', $latestApk->getFilename(), $matches)) {
                $version = 'v' . $matches[1];
            }
        }
    }

    $apkUrl = $latestApk ? asset('storage/apk/' . $latestApk->getFilename()) : '#';

    $view->with(compact('apkUrl', 'version'));
});


Route::get('/download-apk', function () {
    $apkPath = storage_path('app/public/apk');
    $files = File::files($apkPath);

    usort($files, fn($a, $b) => $b->getMTime() <=> $a->getMTime());
    $latest = $files[0] ?? null;

    if (!$latest) {
        abort(404);
    }

    return response()->download($latest->getRealPath(), $latest->getFilename());
});

