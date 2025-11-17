<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">


    <style>
        /* Gradient background and full height */
        body {
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        /* Login card styling */
        .login-card {
            background-color: #ffffffcc;
            border-radius: 1rem;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            padding: 2rem;
            max-width: 400px;
            width: 90vw;
            text-align: center;
        }

        /* Banner Image */
        .login-banner {
            width: 30%;
            border-radius: 1rem 1rem 0 0;
            margin-bottom: 2rem;
        }

        .login-title {
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 1.5rem;
        }

        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
            border-color: #3b82f6;
        }

        /* Button hover effect */
        .btn-primary:hover {
            background-color: #2563eb;
            border-color: #2563eb;
        }

        @media (max-width: 576px) {
            .login-card {
                padding: 1.5rem;
            }

            .login-banner {
                height: 70px;
                width: 70px;
            }
        }
    </style>
</head>

<body>

    <div class="login-card">
        <!-- Banner Image -->
        <img src="{{ asset('assets/images/favicon.png') }}" alt="Login Banner" class="login-banner">

        <h4 class="login-title">Sign In</h4>

        <!-- Display Validation Errors -->
        @if($errors->any())
            <div class="alert alert-danger text-start">
                <ul class="mb-0">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Login Form -->
        <form action="{{ route('login.post') }}" method="POST">
            @csrf
            <div class="mb-3">
                <input type="text" class="form-control" id="user_id_no" name="user_id_no" placeholder="User ID"
                    value="{{ old('user_id_no') }}" required autocomplete="username">
            </div>

            <div class="mb-3">
                <input type="password" class="form-control" id="password" name="password" placeholder="Password"
                    required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary w-100 mb-2">Login</button>
        </form>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>