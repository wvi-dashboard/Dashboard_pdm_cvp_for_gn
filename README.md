# Dashboard PDM CVP for GN

Dashboard statis untuk monitoring pasca-distribusi Cash & Voucher Programming (CVP) untuk Gift Notification (GN) Wahana Visi Indonesia.

Dashboard menggunakan HTML, CSS, dan JavaScript tanpa framework atau backend. Semua sembilan halaman, filter, bahasa Indonesia/Inggris, tema gelap, ekspor CSV, serta cetak halaman/dossier tersedia di browser.

## Menjalankan secara lokal

Prasyarat: Node.js 18 atau lebih baru. Tidak ada package pihak ketiga atau environment variable yang diperlukan.

```bash
npm run dev
```

Buka `http://127.0.0.1:3000/`.

Perintah penting:

```bash
npm test                 # tes perhitungan, filter, render, skema, dan ekspor
npm run validate         # validasi semua dataset yang terdaftar
npm run lint             # pemeriksaan sintaks JavaScript
npm run build            # hasil statis siap-hosting di dist/
npm run example          # build dengan dataset contoh sintetis tambahan
npm run preview          # preview hasil dist/ di port 3000
```

## Struktur

```text
index.html                      shell dan elemen UI tetap
assets/css/dashboard.css        tampilan layar dan responsive layout
assets/css/print.css            layout cetak halaman dan dossier
assets/js/data.js               pemuatan dan validasi JSON
assets/js/metrics.js            pemrosesan data dan perhitungan
assets/js/state.js              dataset aktif, filter, dan state
assets/js/charts.js             renderer chart HTML/CSS
assets/js/components.js         renderer komponen umum
assets/js/pages.js              komposisi sembilan halaman
assets/js/app.js                event, navigasi, export, print, dan lifecycle
assets/js/i18n.js               terjemahan utama
assets/js/translations-extra.js terjemahan tambahan
data/catalog.json               daftar dataset produksi
data/schema.json                kontrak kolom setiap record
data/pdm-2026.json              snapshot data aktif
examples/example-2027.json      contoh sintetis; bukan data survei
scripts/                        validate, build, serve, dan preview example
tests/                          regression tests
```

Alur runtime:

```text
catalog.json → dataset JSON → validasi → state/filter
                                      ↓
                         metrics → cards/charts/tables
```

## Menambahkan dataset baru

1. Salin `examples/example-2027.json` sebagai titik awal atau duplikasi dataset terbaru.
2. Beri setiap record `id` unik dan stabil. Seluruh data demografi berada di record yang sama; tidak ada join berdasarkan posisi array.
3. Simpan file baru langsung di `data/`, misalnya `data/pdm-2027.json`.
4. Tambahkan satu entri ke `data/catalog.json`:

```json
{
  "id": "pdm-2027",
  "path": "pdm-2027.json",
  "label": {
    "id": "PDM GN · Siklus 2027",
    "en": "GN PDM · 2027 cycle"
  }
}
```

5. Jalankan:

```bash
npm run validate
npm test
npm run build
```

Setelah dataset masuk katalog, pilihan dataset muncul otomatis. Area Program dan FSP baru menjadi opsi filter; jumlah responden, KPI, kartu, grafik, tabel, rentang nilai, CSV, dan metadata cetak dihitung ulang dari record terpilih. Kategori multi-respons baru juga dimunculkan sehingga tidak hilang karena daftar kategori lama.

Jika hanya satu snapshot yang harus tersedia, ganti `defaultDataset` di `data/catalog.json`. Dataset lama boleh tetap didaftarkan untuk perbandingan antar-siklus.

## Contoh perilaku dataset baru

`examples/example-2027.json` berisi tiga record sintetis dengan dua Area Program, dua FSP, dan nilai GN hingga Rp4.000.000. Jalankan `npm run example`, lalu `npm run preview`. Pilih **CONTOH SINTETIS · 2027** dari selector Dataset. Dashboard otomatis menampilkan:

- 3 responden dan 2 Area Program;
- filter `Example North` dan `Example South`;
- median GN Rp3,20 juta;
- rentang grafik yang meningkat sampai Rp4,00 juta;
- judul siklus 2027 dan metadata dataset pada hasil cetak/ekspor.

Contoh tersebut sengaja tidak terdaftar di katalog produksi dan tidak berisi data survei nyata.

## Validasi dan aturan data

`data/schema.json` memeriksa tipe seluruh kolom, array informasi enam-item, ID unik, nilai wajib, serta hubungan `danaOk` dengan nominal. Dataset yang tidak valid ditolak sebelum menggantikan dataset aktif; dashboard mempertahankan snapshot valid terakhir dan menampilkan pesan yang dapat dicoba ulang.

Empat nominal yang sudah ditandai tidak valid pada snapshot lama tetap dipertahankan dan tidak ikut statistik nilai GN. Dua belas record dengan jumlah anggota berpenghasilan melebihi jumlah anggota dewasa juga tetap diberi catatan kualitas data di halaman Demografi.

## Deployment

Output `npm run build` adalah situs statis di `dist/`. Folder tersebut dapat dipublikasikan ke GitHub Pages atau static hosting lain. Karena data dimuat dengan `fetch`, membuka `index.html` langsung dari `file://` tidak didukung; gunakan server lokal atau hosting HTTP.
