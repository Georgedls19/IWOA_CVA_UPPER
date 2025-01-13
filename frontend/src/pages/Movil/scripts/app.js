document.getElementById("scanButton").addEventListener("click", async () => {
    const qrResult = document.getElementById("qrResult");

    // Simula la funcionalidad de escaneo QR (puedes integrar una librería como `html5-qrcode` más adelante)
    const fakeQRCode = "http://localhost:3000/crm";
    qrResult.innerHTML = `
    <p>QR escaneado:</p>
    <a href="${fakeQRCode}" target="_blank">${fakeQRCode}</a>
  `;
});
