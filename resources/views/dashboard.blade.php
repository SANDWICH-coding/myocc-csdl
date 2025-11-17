<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'myOCC') }}</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">


    <style>
        html,
        body {
            height: 100%;
        }

        body {
            display: flex;
            flex-direction: column;
            background-color: #f8f9fa;
        }

        /* Main content should take remaining space */
        main {
            flex: 1 0 auto;
        }

        /* Banner image styling */
        .dashboard-banner {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
        }

        .header {
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
        }

        .header .user-info {
            font-weight: 600;
        }

        .dashboard-bg {
            background-image: url('/assets/images/qr-app-man.png');
            background-size: contain;
            /* Fill space */
            background-position: right;
            /* Stick to right side */
            background-repeat: no-repeat;
            min-height: 300px;
            /* Ensures space for image on small screens */
        }



        @media (max-width: 580px) {
            .dashboard-bg {
                background-size: cover;
                /* Switch to full-screen fill */
                background-position: center;
                min-height: 280px;
                
            }

            .event-bg {
                padding: 20px;
                background-color: rgba(31, 31, 31, 0.47);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 0.5rem;
                backdrop-filter: blur(10px);
            }

            .event-text {
                color: #f8f9fa;
            }
        }
    </style>
</head>

<body>

    <!-- Header -->
    <nav class="header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
            <span class="user-info">{{ auth()->user()->user_id_no }}</span>
        </div>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="btn btn-light btn-sm">Logout</button>
        </form>
    </nav>

    <!-- Main Content -->
    <main class="container p-4 rounded dashboard-bg">
        <div class="event-bg">
            <h3 class="mb-2 event-text">Event Attendance Tracker</h3>
            <p class="lead event-text">Scan your QR code to track attendance.</p>

            <div class="row mt-4">
                @foreach ($events as $event)
                    <div class="col-md-4 mb-3">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">{{ $event['event_name'] }}</h5>
                                <p class="card-text">{{ \Carbon\Carbon::parse($event['event_date'])->format('F d, Y') }}</p>
                                <a href="{{ route('dashboard.events.show', $event['id']) }}"
                                    class="btn btn-primary btn-sm">View</a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </main>


    <!-- Footer -->
    @include('layouts.footer')

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>