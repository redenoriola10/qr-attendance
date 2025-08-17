const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPcoOXTI_-TdHREFcR5palDtth3H8vGKYlnYlKHd5JRMh4qfM86vv8zCbhOvCrGWvKnA/exec"; // replace with Apps Script URL

function onScanSuccess(decodedText) {
  document.getElementById("status").innerText = "Scanned: " + decodedText;

  // Send to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ studentId: decodedText })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").innerText = 
      "Saved to Sheet: " + data.student;
  })
  .catch(err => {
    document.getElementById("status").innerText = "Error: " + err;
  });
}

// Start Scanner
let scanner = new Html5QrcodeScanner(
  "reader", 
  { fps: 10, qrbox: { width: 250, height: 250 } },
  false
);
scanner.render(onScanSuccess);
