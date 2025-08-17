/*const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPcoOXTI_-TdHREFcR5palDtth3H8vGKYlnYlKHd5JRMh4qfM86vv8zCbhOvCrGWvKnA/exec"; // replace with Apps Script URL
*/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCOy09u4n0kgYaBDtbCBPuz3u7HFFxugVkwdBw-uvdGrqU3_8kH2TNnpngLFJfhpyKuQ/exec"; // replace with Apps Script URL

// Register Student
document.getElementById("registerForm").addEventListener("submit", function(e){
  e.preventDefault();
  let name = document.getElementById("studentName").value;
  let id = document.getElementById("studentId").value;

  let studentData = { id: id, name: name }; // JSON for QR

  // Save to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ type: "register", studentId: id, studentName: name })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("registerStatus").innerText = "✅ Student added: " + name;

    // Generate QR Code
    let qrDiv = document.getElementById("qrOutput");
    qrDiv.innerHTML = "";
    QRCode.toCanvas(JSON.stringify(studentData), { width: 200 }, function (error, canvas) {
      if (!error) qrDiv.appendChild(canvas);
    });
  })
  .catch(err => {
    document.getElementById("registerStatus").innerText = "❌ Error: " + err;
  });
});

// Attendance Scanner
function onScanSuccess(decodedText) {
  let studentData;
  try {
    studentData = JSON.parse(decodedText); // QR contains {id, name}
  } catch {
    studentData = { id: decodedText, name: "" }; // fallback
  }

  document.getElementById("scanStatus").innerText = "Processing " + studentData.id + "...";

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ 
      type: "attendance", 
      studentId: studentData.id, 
      studentName: studentData.name 
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("scanStatus").innerText = 
      `✅ ${studentData.id} ${studentData.name} marked as ${data.status}`;
  })
  .catch(err => {
    document.getElementById("scanStatus").innerText = "❌ Error: " + err;
  });
}

let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);
