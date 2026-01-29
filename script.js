document.getElementById("infoBtn").addEventListener("click", () => {
  alert(
    "QR ini berfungsi sebagai identitas kepemilikan barang.\n" +
    "Data kunjungan dicatat untuk keamanan."
  );
});


  // Config dari Firebase (paste punya kamu di sini)
  const firebaseConfig = {
	  apiKey: "AIzaSyD1TDvtFhyxcBVvJV_GB8m2h0uhQW3P7iU",
	  authDomain: "my-web-logger.firebaseapp.com",
	  projectId: "my-web-logger",
	  storageBucket: "my-web-logger.firebasestorage.app",
	  messagingSenderId: "768438122129",
	  appId: "1:768438122129:web:aeaec28602f6a05e56b130",
	  measurementId: "G-6BY41YQ19X"
  };

  // Inisialisasi Firebase (versi compat)
  firebase.initializeApp(firebaseConfig);

  // Inisialisasi Firestore
  const db = firebase.firestore();

  // Fungsi logging kunjungan (jalan otomatis saat halaman dibuka)
  function logVisitor() {
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenSize = `${window.screen.width}x${window.screen.height}`;

    db.collection("visits").add({
      timestamp: timestamp,
      userAgent: userAgent,
      language: language,
      screenSize: screenSize,
      // referrer: document.referrer || "direct"  // opsional
    })
    .then((docRef) => {
      console.log("Kunjungan tercatat! ID:", docRef.id);
    })
    .catch((error) => {
      console.error("Gagal simpan log:", error);
    });
  }

  // Panggil fungsi saat halaman load
  window.addEventListener('load', logVisitor);


/* Placeholder tracking (nanti kita sambung ke Supabase) */
console.log("QR scanned at:", new Date().toISOString());
