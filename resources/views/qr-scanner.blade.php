<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QR Code Scanner</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
    #qr-reader { width: 100%; max-width: 500px; margin: 2rem auto; }
    #qr-result { margin-top: 1rem; text-align: center; }
</style>
</head>
<body class="bg-light">

<div class="container">
    <h2 class="text-center mt-4">QR Code Scanner</h2>
    <div id="qr-reader"></div>
    <div id="qr-result" class="alert alert-success d-none"></div>
</div>

<!-- JS QR Scanner -->
<script src="https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const resultContainer = document.getElementById('qr-result');

    function onScanSuccess(decodedText, decodedResult) {
        // Display scanned QR code on page
        resultContainer.innerText = "Scanned QR Code: " + decodedText;
        resultContainer.classList.remove('d-none');

        // Log scanned QR code to console
        console.log("Scanned QR Code:", decodedText);
        console.log("Full decoded result:", decodedResult);

        // Keep scanning continuously (do NOT clear)
    }

    function onScanFailure(error) {
        // Optional: log scan errors
        // console.warn("QR scan error:", error);
    }

    const html5QrcodeScanner = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length) {
            html5QrcodeScanner.start(
                cameras[0].id,
                { fps: 10, qrbox: 250 },
                onScanSuccess,
                onScanFailure
            );
        } else {
            alert("No camera found");
        }
    }).catch(err => {
        alert("Error accessing camera: " + err);
        console.error(err);
    });
});
</script>

</body>
</html>
