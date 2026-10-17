/* Cek apakah pengguna meminta animasi dikurangi di perangkatnya */
const kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ============ GARIS KEMAJUAN SCROLL ============ */
const progres = document.querySelector("#progres");

function perbaruiProgres() {
  const tinggi = document.documentElement.scrollHeight - window.innerHeight;
  const persen = tinggi > 0 ? window.scrollY / tinggi : 0;
  progres.style.transform = "scaleX(" + persen + ")";
}

window.addEventListener("scroll", perbaruiProgres, { passive: true });
perbaruiProgres();


/* ============ INTERAKSI 1: TOMBOL UBAH TEKS ============
   querySelector   : mengambil elemen
   addEventListener: menunggu klik
   textContent     : mengganti isi teks (di sini diketik huruf demi huruf) */
const tombolTeks = document.querySelector("#tombol-teks");
const deskripsi = document.querySelector("#deskripsi");

const daftarKalimat = [
  "I'm a first-year Informatics student exploring the world of technology, discovering new skills, and building a strong foundation in programming and digital innovation.",
  "I'm learning HTML, CSS, and JavaScript to create engaging websites, explore my creativity, and turn innovative ideas into interactive digital experiences.",
  "I'm eager to keep learning, grow my skills, explore new possibilities, and turn creative ideas into meaningful digital experiences."
];
let nomor = 0;
let pengetik = null;   // menyimpan timer efek mengetik

function ketik(kalimat) {
  clearInterval(pengetik);   // hentikan pengetikan sebelumnya kalau masih berjalan

  if (kurangGerak) {
    deskripsi.textContent = kalimat;
    return;
  }

  let jumlahHuruf = 0;
  deskripsi.textContent = "";
  deskripsi.classList.add("mengetik");

  pengetik = setInterval(function () {
    jumlahHuruf++;
    deskripsi.textContent = kalimat.slice(0, jumlahHuruf);
    if (jumlahHuruf >= kalimat.length) {
      clearInterval(pengetik);
      deskripsi.classList.remove("mengetik");
    }
  }, 22);
}

tombolTeks.addEventListener("click", function () {
  nomor = (nomor + 1) % daftarKalimat.length;   // 0, 1, 2, lalu kembali ke 0
  ketik(daftarKalimat[nomor]);
});


/* ============ INTERAKSI 2: TOMBOL GANTI TEMA ============
   classList.toggle menambah class "tema-gelap" kalau belum ada,
   dan menghapusnya kalau sudah ada. */
const tombolTema = document.querySelector("#tombol-tema");
const lingkar = document.querySelector(".lingkar");

tombolTema.addEventListener("click", function () {
  const gelap = document.body.classList.toggle("tema-gelap");
  tombolTema.setAttribute("aria-pressed", gelap);

  // cahaya di belakang foto berdenyut setiap kali tema berganti
  lingkar.classList.remove("berdenyut");
  void lingkar.getBoundingClientRect();   // memaksa browser menghitung ulang agar animasi bisa diulang
  lingkar.classList.add("berdenyut");
});


/* ============ INTERAKSI 3: TOMBOL GANTI FONT ============
   Menambah/menghapus class "font-custom" pada body.
   Aturan font-nya ada di CSS (body.font-custom). */
const tombolFont = document.querySelector("#tombol-font");

tombolFont.addEventListener("click", function () {
  const aktif = document.body.classList.toggle("font-custom");
  tombolFont.setAttribute("aria-pressed", aktif);
  tombolFont.textContent = aktif ? "Original Font" : "Change Font";
});


/* ============ ANIMASI 1: NAMA, HURUF NAIK LALU BISA MELOMPAT ============
   Nama dipecah menjadi <span> per huruf. Animasinya ada di CSS (.huruf). */
const nama = document.querySelector("#nama");
const teksNama = nama.textContent;

nama.setAttribute("aria-label", teksNama);   // pembaca layar tetap membaca nama utuh
nama.textContent = "";

let urutanHuruf = 0;
for (const huruf of teksNama) {
  if (huruf === " ") {
    nama.appendChild(document.createTextNode(" "));   // spasi biasa agar nama bisa turun baris
  } else {
    const span = document.createElement("span");
    span.className = "huruf";
    span.textContent = huruf;
    span.style.setProperty("--n", urutanHuruf);       // dipakai CSS untuk jeda per huruf
    span.setAttribute("aria-hidden", "true");
    nama.appendChild(span);
    urutanHuruf++;
  }
}


/* ============ ANIMASI 2: TULISAN PERAN DIKETIK DAN DIHAPUS BERGANTIAN ============ */
const peran = document.querySelector("#peran");
const daftarPeran = [
  "Informatics Student",
  "Beginner Web Developer",
  "UI Design Enthusiast"
];
let nomorPeran = 0;
let hurufPeran = daftarPeran[0].length;
let menghapus = true;   // mulai dengan menghapus tulisan awal yang sudah tampil

function ketikPeran() {
  const kata = daftarPeran[nomorPeran];
  hurufPeran += menghapus ? -1 : 1;
  peran.textContent = kata.slice(0, hurufPeran);

  let jeda = menghapus ? 35 : 80;
  if (!menghapus && hurufPeran === kata.length) {
    menghapus = true;
    jeda = 1600;                                   // berhenti sebentar agar terbaca
  } else if (menghapus && hurufPeran === 0) {
    menghapus = false;
    nomorPeran = (nomorPeran + 1) % daftarPeran.length;
    jeda = 400;
  }
  setTimeout(ketikPeran, jeda);
}

if (kurangGerak) {
  peran.classList.remove("mengetik");
} else {
  setTimeout(ketikPeran, 2200);   // tunggu animasi pembuka selesai
}


/* ============ ANIMASI 3: KELOPAK BERJATUHAN DI LATAR ============ */
const lapisan = document.querySelector("#kelopak-jatuh");

function buatKelopakJatuh(jumlah) {
  for (let i = 0; i < jumlah; i++) {
    const kelopak = document.createElement("span");
    kelopak.className = "kelopak-jatuh";
    kelopak.style.left = Math.random() * 100 + "%";
    kelopak.style.setProperty("--ukuran", 10 + Math.random() * 14 + "px");
    kelopak.style.setProperty("--durasi", 9 + Math.random() * 9 + "s");
    kelopak.style.setProperty("--ayun", Math.random() * 80 - 40 + "px");
    // delay negatif: kelopak sudah berada di tengah jalan saat halaman dibuka
    kelopak.style.animationDelay = -Math.random() * 18 + "s";
    lapisan.appendChild(kelopak);
  }
}

if (!kurangGerak) {
  buatKelopakJatuh(window.innerWidth < 768 ? 8 : 14);
}


/* ============ ANIMASI 4: FOTO MIRING DAN LENCANA BERGESER MENGIKUTI KURSOR ============ */
const panggung = document.querySelector("#panggung");

if (!kurangGerak) {
  document.addEventListener("pointermove", function (e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;    // -1 sampai 1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    panggung.style.setProperty("--mx", x);
    panggung.style.setProperty("--my", y);
  });
}


/* ============ ANIMASI 5: PERCIKAN MENGIKUTI KURSOR (hanya untuk mouse) ============ */
const warnaPercik = ["var(--thulian)", "var(--olive)", "var(--fairy)", "var(--tea)"];
let waktuPercik = 0;

if (!kurangGerak && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", function (e) {
    const sekarang = performance.now();
    if (sekarang - waktuPercik < 60) return;   // batasi agar tidak terlalu rapat
    waktuPercik = sekarang;

    const percik = document.createElement("span");
    percik.className = "percik";
    percik.style.left = e.clientX + "px";
    percik.style.top = e.clientY + "px";
    percik.style.background = warnaPercik[Math.floor(Math.random() * warnaPercik.length)];
    percik.style.setProperty("--dx", Math.random() * 30 - 15 + "px");
    percik.style.setProperty("--dy", Math.random() * 30 + 10 + "px");

    document.body.appendChild(percik);
    percik.addEventListener("animationend", function () {
      percik.remove();
    });
  });
}


/* ============ ANIMASI 6: SENTUH FOTO, MEKAR ULANG DAN KELOPAK MENYEBAR ============ */
const bingkai = document.querySelector("#bingkai");
const foto = document.querySelector("#foto");

// kalau file foto tidak ditemukan, tampilkan inisial sebagai cadangan
function periksaFoto() {
  if (foto.complete && foto.naturalWidth === 0) {
    bingkai.classList.add("tanpa-foto");
  }
}
foto.addEventListener("error", function () {
  bingkai.classList.add("tanpa-foto");
});
periksaFoto();

function sebarKelopak(x, y) {
  const jumlah = 14;
  for (let i = 0; i < jumlah; i++) {
    const kelopak = document.createElement("span");
    kelopak.className = "kelopak-pecah";

    const sudut = (Math.PI * 2 * i) / jumlah + Math.random() * 0.4;
    const jarak = 90 + Math.random() * 100;

    kelopak.style.left = x + "px";
    kelopak.style.top = y + "px";
    kelopak.style.setProperty("--dx", Math.cos(sudut) * jarak + "px");
    kelopak.style.setProperty("--dy", Math.sin(sudut) * jarak + "px");
    kelopak.style.setProperty("--putar", Math.random() * 540 - 270 + "deg");

    document.body.appendChild(kelopak);
    kelopak.addEventListener("animationend", function () {
      kelopak.remove();   // bersihkan setelah animasi selesai
    });
  }
}

panggung.addEventListener("click", function (e) {
  if (kurangGerak) return;

  // mulai ulang animasi mekar pada bingkai foto
  bingkai.style.animation = "none";
  void bingkai.getBoundingClientRect();
  bingkai.style.animation = "";

  // klik dengan keyboard tidak punya posisi kursor, jadi pakai titik tengah panggung
  const kotak = panggung.getBoundingClientRect();
  const x = e.clientX || kotak.left + kotak.width / 2;
  const y = e.clientY || kotak.top + kotak.height / 2;
  sebarKelopak(x, y);
});

// agar bisa dipakai lewat keyboard (Enter atau Spasi)
panggung.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    panggung.click();
  }
});


/* ============ KARTU KETERAMPILAN ============ */
const semuaKartu = document.querySelectorAll(".kartu");

/* hitung naik dari 0% sampai target, dengan gerakan melambat di akhir */
function hitungNaik(elemen, target, durasi) {
  const mulai = performance.now();

  function langkah(sekarang) {
    const p = Math.min((sekarang - mulai) / durasi, 1);
    const halus = 1 - Math.pow(1 - p, 3);
    elemen.textContent = Math.round(target * halus) + "%";
    if (p < 1) requestAnimationFrame(langkah);
  }
  requestAnimationFrame(langkah);
}

/* persen kemampuan dibaca dari atribut data-persen di HTML */
semuaKartu.forEach(function (kartu) {
  kartu.style.setProperty("--p", kartu.dataset.persen);
});

/* kartu muncul saat di-scroll: masuk dari arah berbeda, ikon tergambar,
   batang terisi, dan angka persen menghitung naik */
function tampilkanKartu(kartu) {
  kartu.classList.remove("sembunyi");
  kartu.classList.add("terlihat");

  const angka = kartu.querySelector(".angka");
  const target = Number(kartu.dataset.persen);

  if (kurangGerak) {
    angka.textContent = target + "%";
  } else {
    setTimeout(function () {
      hitungNaik(angka, target, 1500);
    }, 400);
  }
}

if (!kurangGerak && "IntersectionObserver" in window) {
  semuaKartu.forEach(function (kartu) {
    kartu.classList.add("sembunyi");
  });

  const pengamat = new IntersectionObserver(function (daftar) {
    daftar.forEach(function (item) {
      if (item.isIntersecting) {
        const urutan = Array.from(semuaKartu).indexOf(item.target);
        // kartu muncul bergantian, selisih 150 milidetik
        setTimeout(function () {
          tampilkanKartu(item.target);
        }, urutan * 150);
        pengamat.unobserve(item.target);
      }
    });
  }, { threshold: 0.2 });

  semuaKartu.forEach(function (kartu) {
    pengamat.observe(kartu);
  });
} else {
  semuaKartu.forEach(tampilkanKartu);
}

/* buka/tutup detail kartu */
function ubahDetail(kartu) {
  const aktif = kartu.classList.toggle("aktif");
  kartu.setAttribute("aria-expanded", aktif);
  kartu.querySelector(".teks-petunjuk").textContent = aktif ? "Hide details" : "View details";
}

semuaKartu.forEach(function (kartu) {

  // klik: buka/tutup detail + riak dari titik klik
  kartu.addEventListener("click", function (e) {
    if (!kurangGerak) {
      const kotak = kartu.getBoundingClientRect();
      const riak = document.createElement("span");
      riak.className = "riak";
      riak.style.left = (e.clientX ? e.clientX - kotak.left : kotak.width / 2) + "px";
      riak.style.top = (e.clientY ? e.clientY - kotak.top : kotak.height / 2) + "px";
      kartu.appendChild(riak);
      riak.addEventListener("animationend", function () {
        riak.remove();
      });
    }
    ubahDetail(kartu);
  });

  // keyboard: Enter atau Spasi
  kartu.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      kartu.click();
    }
  });

  // miring 3D dan cahaya mengikuti kursor (hanya untuk mouse)
  kartu.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || kurangGerak) return;

    const kotak = kartu.getBoundingClientRect();
    const x = (e.clientX - kotak.left) / kotak.width;    // 0 sampai 1
    const y = (e.clientY - kotak.top) / kotak.height;

    kartu.style.setProperty("--pos-x", x * 100 + "%");
    kartu.style.setProperty("--pos-y", y * 100 + "%");
    kartu.style.setProperty("--ry", (x - 0.5) * 14 + "deg");
    kartu.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
  });

  // kursor keluar: kartu kembali tegak
  kartu.addEventListener("pointerleave", function () {
    kartu.style.removeProperty("--rx");
    kartu.style.removeProperty("--ry");
  });
});