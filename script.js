document.getElementById("infoBtn").addEventListener("click", () => {
  alert(
    "QR ini berfungsi sebagai identitas kepemilikan barang.\n" +
    "Data kunjungan dicatat untuk keamanan."
  );
});

/* Placeholder tracking (nanti kita sambung ke Supabase) */
console.log("QR scanned at:", new Date().toISOString());