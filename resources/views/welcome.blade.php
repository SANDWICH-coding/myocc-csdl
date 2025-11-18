<!-- //views/welcome.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'myOCC') }}</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Required for footer -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    <style>
        /* Reset & basic styles */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }

        body {
            background: #f9f9f9;
            color: #333;
            line-height: 1.6;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        img {
            max-width: 100%;
            display: block;
        }

        /* Container */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
        }

        /* Hero Section */
        .hero {
            position: relative;
            min-height: 100vh;
            background-image: url("{{ asset('assets/images/bg.jpg') }}");
            /* ← your hero image */
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            /* optional parallax (looks great on desktop, safe on mobile too in 2025) */
            background-attachment: fixed;

            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            overflow: hidden;
        }

        /* Dark overlay (adjust opacity/color to taste) */
        .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            /* dark overlay */
            /* if you prefer your original gray tint → rgba(159, 159, 159, 0.7) */
            z-index: 1;
        }

        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 900px;
            /* keeps text from stretching too wide */
            padding: 20px;
            padding: 60px 20px;
            /* space from edges */
        }

        .hero h1 {
            font-size: clamp(2rem, 6vw, 3.8rem);
            /* bigger on large screens, still good on mobile */
            margin-bottom: 20px;
            font-weight: 700;
        }

        .hero p {
            font-size: clamp(1rem, 3vw, 1.3rem);
            margin-bottom: 35px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero .cta-btn {
            display: inline-block;
            background: #ff9900;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: 600;
            transition: 0.3s;
        }

        .hero .cta-btn:hover {
            background: #e68a00;
        }

        /* Features Section */
        .features {
            padding: 60px 50px;
            background: #fff;
        }

        .features h2 {
            text-align: center;
            font-size: 1.8rem;
            margin-bottom: 50px;
            font-weight: 700;
        }

        .feature-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }

        .feature-card {
            background: #f1f1f1;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-card img {
            width: 60px;
            margin-bottom: 20px;
        }

        /* Screenshots Section */
        .screenshots {
            padding: 60px 0;
            background: #dadadaff;
        }

        .screenshots h2 {
            text-align: center;
            font-size: 1.8rem;
            margin-bottom: 40px;
            font-weight: 700;
        }

        .screenshot-gallery {
            display: flex;
            overflow-x: auto;
            gap: 20px;
            padding: 0 20px;
        }

        .screenshot-gallery img {
            border-radius: 15px;
            flex: 0 0 auto;
            width: 250px;
            height: 500px;
            object-fit: cover;
        }

        /* CTA Section */
        .cta-section {
            padding: 60px 20px;
            background: #4f46e5;
            color: white;
            text-align: center;
        }

        .cta-section h2 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .cta-section a {
            display: inline-block;
            background: #ff9900;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: 600;
            transition: 0.3s;
        }

        .cta-section a:hover {
            background: #e68a00;
        }

        /* Footer */
        footer {
            padding: 20px;
            font-size: 0.9rem;
            color: #777;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 1.5rem;
            }

            .hero p {
                font-size: 0.95rem;
            }

            .screenshot-gallery img {
                width: 200px;
                height: 400px;
            }
        }
    </style>
</head>

<body>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <div class="text-center">
                <img src="{{ asset('assets/images/banner.png') }}" alt="Logo" class="d-inline-block mx-auto mb-5"
                    style="height: 50px;">
            </div>

            <h1>Monitor Event Attendance & Violation Records Easily</h1>
            <p>Face recognition, real-time location tracking and QR Code scanning to modernize student management.</p>

            <a href="{{ $apkUrl ?? '#' }}" class="cta-btn" @if($apkUrl ?? '#' !== '#') download @endif>
                <i class="bi bi-android2 me-2"></i>
                Download for Android
                <small class="ms-2 opacity-75">{{ $version }}</small>
            </a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features container">
        <h2>App Features</h2>
        <div class="feature-cards">
            <div class="feature-card">
                <img src="https://cdn-icons-png.flaticon.com/128/16318/16318187.png" alt="QR Code">
                <h3>Student Violations via QR</h3>
                <p>Quickly record student violations using QR Codes with minimal hassle.</p>
            </div>
            <div class="feature-card">
                <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Location">
                <h3>Real-Time Location Tracking</h3>
                <p>Track student attendance in real-time with location monitoring for events.</p>
            </div>
            <div class="feature-card">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Face Recognition">
                <h3>Face Recognition</h3>
                <p>Ensure accurate attendance using AI-powered face recognition technology.</p>
            </div>
        </div>
    </section>

    <!-- Screenshots Section -->
    <section class="screenshots">
        <h2>App Screenshots</h2>
        <div class="screenshot-gallery container">
            <img src="/assets/images/ss1.png" alt="Screenshot 1">
            <img src="/assets/images/ss2.png" alt="Screenshot 2">
            <img src="/assets/images/ss3.png" alt="Screenshot 3">
            <img src="/assets/images/ss4.png" alt="Screenshot 4">
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="download">
        <h2>Get Started Now!</h2>

        <a href="{{ url('/download-apk') }}" class="cta-btn">
            <i class="bi bi-android2 me-2"></i>
            Download for Android ({{ $version }})
        </a>
    </section>

    <!-- Footer -->
    @include('layouts.footer')

</body>

</html>