<footer class="bg-dark text-white py-4">
    <div class="container">
        <div class="row">
            <!-- Company Info -->
            <div class="col-md-4 mb-3">
                <h5 class="fw-bold">myOCC</h5>
                <p class="small">Opol Community College</p>
                <p class="small">Email: myocc.ph@gmail.com</p>
            </div>

            <!-- Quick Links -->
            <div class="col-md-4 mb-3">
                <h5 class="fw-bold">Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="{{ url('/') }}" class="text-white text-decoration-none">Home</a></li>
                </ul>
            </div>

            <!-- Social Media -->
            <div class="col-md-4 mb-3">
                <h5 class="fw-bold">Follow Us</h5>
                <a href="#" class="text-white me-2"><i class="bi bi-facebook"></i></a>
                <a href="#" class="text-white me-2"><i class="bi bi-twitter"></i></a>
                <a href="#" class="text-white me-2"><i class="bi bi-instagram"></i></a>
            </div>
        </div>

        <div class="text-center mt-3 small">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</footer>