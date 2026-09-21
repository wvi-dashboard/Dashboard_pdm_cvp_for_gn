import {extraEnglish,englishPatterns} from './translations-extra.js';
export let currentLang = 'id';
export function setLanguage(lang){ currentLang=lang==='en'?'en':'id'; } // 'id' or 'en'

const EN_DICT = {
  // Navigation & Slicers
  "Menu Navigasi": "Navigation Menu",
  "Dashboard PDM CVP for GN": "PDM CVP for GN Dashboard",
  "Cover": "Cover",
  "Overview": "Overview",
  "Ringkasan 6 area asesmen": "Summary of 6 assessment areas",
  "Demografi": "Demographics",
  "Demografi Responden &amp; Rumah Tangga": "Respondent &amp; Household Demographics",
  "Profil anak penerima, responden, kepala keluarga, dan rumah tangga": "Profile of child beneficiaries, respondents, household heads, and families",
  "Informasi": "Information",
  "Area 1 — Penyediaan Informasi": "Area 1 — Information Provision",
  "Tabel 1 &amp; 2": "Tables 1 &amp; 2",
  "Kinerja FSP": "FSP Performance",
  "Area 2 — Kinerja Penyedia Jasa Keuangan (FSP)": "Area 2 — Financial Service Provider (FSP) Performance",
  "Tabel 3 &amp; 4": "Tables 3 &amp; 4",
  "Distribusi": "Distribution",
  "Area 3 — Proses Distribusi": "Area 3 — Distribution Process",
  "Tabel 5, 6 &amp; 7": "Tables 5, 6 &amp; 7",
  "Penggunaan": "Utilization",
  "Area 4 — Penggunaan Dana": "Area 4 — Fund Utilization",
  "Tabel 8": "Table 8",
  "Kepuasan": "Satisfaction",
  "Area 5 — Kepuasan &amp; Perbandingan Modalitas": "Area 5 — Satisfaction &amp; Modality Comparison",
  "Tabel 9": "Table 9",
  "Akuntabilitas": "Accountability",
  "Area 6 — Akuntabilitas": "Area 6 — Accountability",
  "Tabel 11": "Table 11",
  "Tabel A": "Table A",
  "TABEL 1–11": "TABLES 1–11",
  "TABEL 16": "TABLE 16",
  "TABEL 15": "TABLE 15",
  "TABEL 6": "TABLE 6",
  "TABEL 13": "TABLE 13",
  "TABEL 1": "TABLE 1",
  "TABEL 2": "TABLE 2",
  "TABEL 3": "TABLE 3",
  "TABEL 4": "TABLE 4",
  "TABEL 5": "TABLE 5",
  "TABEL 7": "TABLE 7",
  "TABEL 8": "TABLE 8",
  "TABEL 9": "TABLE 9",
  "TABEL 11": "TABLE 11",

  // Slicer Titles & Actions
  "Area Program": "Program Area",
  "FSP yang dipakai": "FSP Used",
  "Pernah terima GN modalitas lama": "Received Old GN Modality",
  "Pilih Semua": "Select All",
  "Kosongkan": "Clear",
  "(Pilih semua)": "(Select all)",
  "Semua": "All",
  "Ya": "Yes",
  "Tidak": "No",
  "Ekspor CSV": "Export CSV",
  "Cetak PDF": "Print PDF",
  "Bersihkan filter": "Reset filters",

  // KPIs across pages
  "Responden (RC)": "Respondents (RC)",
  "RC terwawancara pada seleksi ini": "RCs interviewed in this selection",
  "AP dalam seleksi": "PAs in selection",
  "Nilai GN median": "Median GN Value",
  "Kepuasan program": "Program Satisfaction",
  "Tahu mekanisme komplain": "Aware of Complaint Mechanism",
  "Median usia anak": "Median Child Age",
  "Anak perempuan": "Female Children",
  "Responden perempuan": "Female Respondents",
  "RT dengan anggota disabilitas": "Households with Disabled Member",
  "tidak ada nilai valid": "no valid values",

  // Overview Page (pg1)
  "Area 1 · Informasi lengkap 6/6 sub-item": "Area 1 · Complete information 6/6 sub-items",
  "Area 2 · Puas/sangat puas pelayanan FSP": "Area 2 · Satisfied/very satisfied with FSP service",
  "Area 3 · Dana diterima sesuai informasi": "Area 3 · Funds received matched information",
  "Area 4 · Kebutuhan dasar terpenuhi semua/sebagian besar": "Area 4 · Basic needs met completely/mostly",
  "Area 5 · Puas/sangat puas program GN": "Area 5 · Satisfied/very satisfied with GN program",
  "Area 6 · Tahu mekanisme feedback/komplain": "Area 6 · Aware of feedback/complaint mechanism",
  "Indikator penanda per area asesmen": "Key Benchmark Indicators per Assessment Area",
  "Profil responden": "Respondent Profile",
  "Responden terdata per Area Program": "Registered Respondents per Program Area",
  "Nilai GN yang diterima per AP": "GN Value Received per Program Area",
  "Rentang terendah–tertinggi · garis oranye = median": "Min–max range · orange line = median",
  "rentang min–max": "min–max range",
  "median": "median",
  "Nasional": "National",
  "Usia anak penerima": "Child beneficiary age",
  "Responden adalah kepala keluarga": "Respondent is household head",
  "Kepala keluarga perempuan": "Female household head",
  "Pendidikan KK sampai SD": "HoH education up to Primary",
  "Ada anggota keluarga disabilitas": "Family member with disability",
  "Rumah milik sendiri": "Own house",
  "Jumlah anggota keluarga": "Household size",
  "\"Apa yang menurut Anda PALING BAIK dari proses pemberian GN saat ini?\"": '"What do you think is BEST about the current GN distribution process?"',
  "\"Jika bisa mengubah SATU HAL dari proses pemberian GN, apa yang akan Anda ubah?\"": '"If you could change ONE THING about the GN distribution, what would it be?"',

  // Demografi (page_demografi)
  "Jenis kelamin anak penerima": "Child Beneficiary Gender",
  "Kelompok usia anak penerima": "Child Beneficiary Age Group",
  "Status sekolah anak saat ini": "Current School Status of Child",
  "Jumlah anak usia 0–18 tahun dalam RT": "Children (0–18 yo) in Household",
  "Jumlah anak usia 0\u201318 tahun dalam RT": "Children (0–18 yo) in Household",
  "Hubungan responden dengan kepala keluarga": "Respondent Relationship to Household Head",
  "Jenis kelamin responden &amp; kepala keluarga": "Gender of Respondent &amp; Household Head",
  "Pendidikan terakhir kepala keluarga": "Highest Education of Household Head",
  "Ukuran rumah tangga": "Household Size",
  "Kepemilikan rumah yang ditempati RC": "Home Ownership Status of RC",
  "Inklusi &amp; disabilitas": "Inclusion &amp; Disability",
  "Profil demografi per Area Program": "Demographic Profile per Program Area",
  "Perempuan": "Female",
  "Laki-laki": "Male",
  "Responden — Perempuan": "Respondent — Female",
  "Responden — Laki-laki": "Respondent — Male",
  "Kepala keluarga — Perempuan": "Household Head — Female",
  "Kepala keluarga — Laki-laki": "Household Head — Male",
  "Kepala keluarga (responden sendiri)": "Household Head (Self)",
  "Isteri": "Wife/Spouse",
  "Suami": "Husband",
  "Orang tua / mertua": "Parent / In-law",
  "Anak": "Child",
  "Kerabat lainnya": "Other relative",
  "Tidak/belum sekolah": "No formal schooling",
  "SD": "Primary School (SD)",
  "SMP": "Junior High (SMP)",
  "SMA": "Senior High (SMA)",
  "Perguruan Tinggi": "Higher Education / University",
  "Balita / belum sekolah": "Toddler / Not in school",
  "Balita": "Toddler",
  "PAUD": "Early Childhood Education (PAUD)",
  "TK": "Kindergarten (TK)",
  "SD / sederajat": "Primary (SD) / Equivalent",
  "SD/sederajat": "Primary (SD) / Equivalent",
  "SMP / sederajat": "Junior High (SMP) / Equivalent",
  "SMP/sederajat": "Junior High (SMP) / Equivalent",
  "SMA / sederajat": "Senior High (SMA) / Equivalent",
  "SMA/sederajat": "Senior High (SMA) / Equivalent",
  "Putus sekolah": "Dropped out",
  "Putus Sekolah": "Dropped out",
  "Milik sendiri": "Own house",
  "Kontrak": "Rented",
  "Menumpang": "Staying with relatives",
  "Lainnya": "Other",
  "Melihat": "Seeing",
  "Mendengar": "Hearing",
  "Berjalan": "Walking",
  "Mengingat": "Remembering/Cognitive",
  "Mengurus diri": "Self-care",
  "Berkomunikasi": "Communicating",
  "Tidak diisi (skip logic)": "Not filled (skip logic)",
  "Urutan jenjang": "Educational levels in order",
  "Pengambil keputusan rumah tangga": "Household decision-maker",
  "Rata-rata anggota RT": "Average HH members",
  "Rata-rata anggota usia 0–18 th": "Avg members aged 0–18 yo",
  "Rata-rata anggota usia 0\u201318 th": "Avg members aged 0–18 yo",
  "Rata-rata anggota usia >18 th": "Avg members aged >18 yo",
  "Median usia responden": "Median respondent age",
  "Median usia kepala keluarga": "Median HH head age",
  "Milik sendiri (SHM/Adat/Girik)": "Owned (Title/Customary)",
  "Menumpang / tinggal bersama keluarga": "Staying with family/relatives",
  "Sewa / kontrak": "Rented",
  "RT dengan anggota disabilitas": "HH with disabled member",
  "RT tanpa disabilitas tercatat": "HH without reported disability",
  "Jenis kebutuhan khusus memakai angka absolut": "Disability types show absolute counts",

  // Area 1 (pg2 - Information)
  "Information Completeness Funnel — 6 sub-item informasi GN": "Information Completeness Funnel — 6 GN Info Sub-items",
  "Kelengkapan informasi per AP": "Information Completeness per Program Area",
  "Matriks sub-item informasi × Area Program": "Information Sub-items Matrix × Program Area",
  "Sumber informasi yang diterima RC": "Information Sources Received by RCs",
  "Channel informasi yang disukai RC": "Preferred Information Channels by RCs",
  "Staf WVI: sumber aktual dibanding preferensi": "WVI Staff: Actual Source vs Preference",
  "Sumber dan preferensi channel per AP": "Sources and Channel Preferences per Program Area",
  "Informasi lokasi distribusi": "Distribution location information",
  "Dokumen yang dibutuhkan untuk pencairan": "Required documents for disbursement",
  "Batasan barang yang boleh dibeli": "Item purchase restrictions",
  "Nilai cash GN yang akan diterima": "GN cash value to be received",
  "Kertas rencana belanja": "Shopping plan sheet",
  "Tahapan pencairan": "Disbursement process stages",
  "LENGKAP SEMUA 6 SUB-ITEM": "ALL 6 SUB-ITEMS COMPLETE",
  "Staf WVI": "WVI Staff",
  "Kader / PJI / pendamping": "Cadre / PJI / Facilitator",
  "Kader perlindungan anak / PJI": "Child protection cadre / PJI",
  "Pemerintah Desa": "Village Government",
  "Pemerintah setempat": "Local Government",
  "Telepon / SMS / WhatsApp": "Phone / SMS / WhatsApp",
  "Pertemuan dusun": "Hamlet / Community Meeting",
  "Media cetak": "Printed Media",
  "Media sosial": "Social Media",
  "Menerima informasi umum program WVI": "Received general WVI program information",
  "Menyebut staf WVI sebagai sumber <b>dan</b> preferensi": "Identified WVI staff as both source <b>and</b> preference",
  "Menyebut staf WVI hanya sebagai sumber aktual": "Identified WVI staff only as actual source",
  "Menyebut staf WVI hanya sebagai preferensi": "Identified WVI staff only as preference",
  "Tidak menyebut staf WVI di kedua pertanyaan": "Did not mention WVI staff in either question",
  "Sumber informasi kader / PJI": "Information source: cadre / PJI",
  "Lokasi<br>distribusi": "Distribution<br>location",
  "Dokumen<br>pencairan": "Disbursement<br>documents",
  "Batasan<br>barang": "Item<br>restrictions",
  "Nilai cash<br>GN": "GN cash<br>value",
  "Kertas rencana<br>belanja": "Shopping<br>plan",
  "Tahapan<br>pencairan": "Disbursement<br>stages",

  // Area 2 (pg3 - FSP Performance)
  "FSP yang digunakan untuk mencairkan GN": "FSP Used for GN Disbursement",
  "Siapa yang menyerahkan GN kepada RC": "Entity Handing Over GN to RC",
  "Persepsi proses pemberian GN melalui FSP": "Perceptions of GN Process via FSP",
  "Hal yang menyulitkan proses": "Factors Complicating the Process",
  "Aksesibilitas FSP": "FSP Accessibility",
  "Transparansi potongan biaya": "Transparency of Fee Deductions",
  "Potongan biaya per Area Program": "Fee Deductions per Program Area",
  "Kepuasan terhadap pelayanan FSP": "Satisfaction with FSP Services",
  "Puas / Sangat Puas": "Satisfied / Very Satisfied",
  "Puas / sangat puas": "Satisfied / very satisfied",
  "Tidak Puas / Sangat Tidak Puas": "Dissatisfied / Very Dissatisfied",
  "Puas/sangat puas pelayanan FSP": "Satisfied/very satisfied with FSP service",
  "Petugas FSP": "FSP Staff",
  "Petugas WVI": "WVI Staff",
  "Petugas Kantor Desa": "Village Office Staff",
  "Petugas Kantor Kecamatan": "Sub-district Staff",
  "Mudah": "Easy",
  "Sulit": "Difficult",
  "Sangat Puas": "Very Satisfied",
  "Puas": "Satisfied",
  "Biasa": "Neutral",
  "Tidak Puas": "Dissatisfied",
  "Sangat Tidak Puas": "Very Dissatisfied",
  "Ada potongan": "Reported fee deduction",
  "Tidak ada potongan": "No fee deduction",
  "Melaporkan ada potongan": "Reported fee deduction",
  "Melaporkan biaya Rp 0": "Reported IDR 0 cost",
  "Median biaya transport": "Median Transport Cost",
  "Jarak median ke FSP": "Median Distance to FSP",
  "Antrian panjang": "Long queue",
  "Jarak jauh": "Far distance",
  "Persyaratan banyak": "Excessive requirements",
  "Biaya transport": "Transportation cost",
  "Pelayanan tidak ramah": "Unfriendly service",
  "Persyaratan sulit": "Difficult requirements",
  "Jadwal bentrok": "Schedule conflict",
  "Jadwal molor": "Delayed schedule",
  "Info tidak jelas": "Unclear info",
  "Harus datang ke kantor FSP": "Required visit to FSP office",
  "Pernah pakai FSP ini sebelumnya": "Previously used this FSP",
  "Tetap kantor pos": "Remained at post office",
  "Dapat info tata cara pengambilan": "Received instructions on collection procedure",
  "Agen laku pandai (BRILink)": "Branchless banking agent (BRILink)",
  "Bank lain": "Other Bank",
  "E-wallet (Ovo/Dana)": "E-wallet (Ovo/Dana)",
  "CU/Kopdit": "Credit Union / Cooperative",

  // Area 3 (pg4 - Distribution)
  "Jarak waktu informasi sampai dana bisa diambil": "Time Interval from Info to Fund Collection",
  "Kesesuaian dana yang diterima": "Accuracy of Funds Received",
  "Total Cost of Access — biaya transport": "Total Cost of Access — Transport Cost",
  "Kehilangan kesempatan kerja": "Loss of Work/Income Opportunities",
  "Lokasi penerimaan, keamanan, dan perlakuan": "Disbursement Location, Safety, and Treatment",
  "Cara penyaluran GN yang dinilai lebih tepat oleh RC": "GN Modality Deemed Most Appropriate by RCs",
  "Cara penyaluran yang dinilai lebih tepat, per AP": "Modality Deemed Most Appropriate per Program Area",
  "Dana sesuai informasi awal": "Funds matched initial info",
  "Lokasi sesuai informasi awal": "Location matched initial info",
  "Merasa aman selama proses": "Felt safe during process",
  "Merasa aman saat distribusi": "Felt safe during distribution",
  "Diperlakukan dengan hormat": "Treated with respect",
  "Ya, kehilangan": "Yes, lost work opportunity",
  "Tidak kehilangan": "Did not lose work",
  "Tidak relevan (tidak bekerja)": "Not relevant (not employed)",
  "Modalitas CVP (sekarang)": "CVP Modality (Current Cash)",
  "Modalitas lama (barang dari staff)": "Old Modality (In-kind goods from staff)",
  "Voucher": "Voucher",
  "Sama saja": "Indifferent / Either",
  "Langsung dari staf": "Directly from staff",

  // Area 4 (pg5 - Fund Utilization)
  "Kategori penggunaan dana GN": "GN Fund Utilization Categories",
  "Sejauh mana dana GN memenuhi kebutuhan dasar RT": "Extent GN Met Basic Household Needs",
  "Kebutuhan dasar yang tidak dapat dipenuhi": "Basic Needs That Could Not Be Met",
  "Pembelian rokok, kosmetik, atau minuman beralkohol": "Purchases of Tobacco, Cosmetics, or Alcohol",
  "Keputusan penggunaan dan tempat belanja": "Spending Decision & Shopping Location",
  "Kebutuhan yang ingin dibeli tetapi tidak diperbolehkan aturan": "Items Desired but Restricted by Rules",
  "Pendidikan anak": "Child Education",
  "Pangan pokok": "Staple Food",
  "Pangan dasar": "Basic Food",
  "Kesehatan (berobat)": "Health / Medical Care",
  "Pakaian": "Clothing",
  "Perabot RT": "Household Furnishing",
  "Bayar utang": "Debt Repayment",
  "Tabungan": "Savings",
  "Pangan baduta": "Infant/Toddler Nutrition",
  "Pangan bumil/busui": "Maternal/Lactating Nutrition",
  "Kios/warung": "Local Kiosk/Stall",
  "Pasar tradisional": "Traditional Market",
  "Minimarket": "Minimarket",
  "Supermarket": "Supermarket",
  "Mall": "Shopping Mall",
  "Online": "Online Shop",
  "Toko": "Retail Shop",
  "Pusat perbelanjaan": "Commercial Center",
  "Sebagian besar": "Most",
  "Setengah": "Half",
  "Kurang dari setengah": "Less than half",
  "Tidak sama sekali": "Not at all",
  "Dipakai untuk pendidikan anak": "Used for child education",
  "Bantuan sesuai kebutuhan anak": "Assistance aligned with child needs",
  "Melaporkan pembelian rokok / kosmetik / alkohol": "Reported buying tobacco / cosmetics / alcohol",
  "Menjawab mudah membelanjakan dana": "Reported funds were easy to spend",
  "Anak penerima paling dominan memutuskan": "Child beneficiary had primary say in decision",
  "Menyatakan barang langka": "Reported goods were scarce",
  "Menyatakan harga barang naik": "Reported commodity prices increased",

  // Area 5 (pg6 - Satisfaction & Comparison)
  "Sebaran kepuasan keseluruhan": "Overall Satisfaction Distribution",
  "Kepuasan per Area Program": "Satisfaction per Program Area",
  "Bantuan dari organisasi atau pihak lain": "Assistance from Other Organizations",
  "Perbandingan CVP dengan modalitas lama, per dimensi": "CVP vs Previous Modality by Dimension",
  "Preferensi modalitas keseluruhan, per AP": "Overall Modality Preference per Program Area",
  "Perbandingan modalitas": "Modality Comparison",
  "Pilihan / fleksibilitas": "Choice & Flexibility",
  "Kebutuhan anak": "Child Needs",
  "Kemudahan proses": "Process Convenience",
  "Kecepatan proses": "Process Speed",
  "Privasi / martabat": "Privacy & Dignity",
  "Lebih baik": "Better",
  "Lebih cepat": "Faster",
  "Lebih mudah": "Easier",
  "Barang langsung": "In-kind goods directly",
  "Dibantu organisasi / pihak lain": "Assisted by other organizations/parties",
  "Subset pernah terima modalitas lama": "Subset who received old modality",

  // Area 6 (pg7 - Accountability)
  "Accountability Funnel — mekanisme komplain": "Accountability Funnel — Complaint Mechanism",
  "Channel yang disukai untuk mengajukan keluhan": "Preferred Channels for Complaints",
  "Pengetahuan mekanisme komplain per AP": "Awareness of Complaint Mechanism per Program Area",
  "Permintaan jasa timbal balik": "Requests for Reciprocal Favors / SEA",
  "Pernah memakai mekanisme": "Have used the mechanism",
  "Puas / sangat puas penyelesaian": "Satisfied / very satisfied with resolution",
  "Puas penyelesaian komplain": "Satisfied with complaint resolution",
  "Kotak suara": "Suggestion / Complaint Box",
  "Langsung ke staf WVI": "Direct to WVI Staff",
  "Telepon WVI": "WVI Hotline / Phone",
  "Kader Posyandu": "Posyandu / Health Cadre",
  "Tokoh masyarakat": "Community Leader",
  "SMS aduan": "Complaint SMS",
  "Ada permintaan": "Requests reported",
  "Tidak ada permintaan": "No requests reported"
};

export function tr(s){
  if(currentLang !== 'en' || !s || typeof s !== 'string') return s;
  if(extraEnglish[s]) return extraEnglish[s];
  if(EN_DICT[s]) return EN_DICT[s];
  const t = s.trim();
  if(extraEnglish[t]) return extraEnglish[t];
  if(EN_DICT[t]) return EN_DICT[t];
  const rating=t.match(/^(.*?) \((\d)\)$/);
  if(rating) return tr(rating[1])+' ('+rating[2]+')';

  // Dynamic regex replacements for recurring patterns
  let res = s;
  res = res.replace(/\bRC terwawancara pada seleksi ini\b/g, 'RCs interviewed in this selection');
  res = res.replace(/\bAP dalam seleksi\b/g, 'PAs in selection');
  res = res.replace(/\bterwawancara\b/g, 'interviewed');
  res = res.replace(/\brentang\b/g, 'range');
  res = res.replace(/\bskala 1–5\b/g, 'scale 1–5');
  res = res.replace(/\bskala 1\u20135\b/g, 'scale 1–5');
  res = res.replace(/\bdari (\d+) RC\b/g, 'of $1 RCs');
  res = res.replace(/\bdari (\d+) anak\b/g, 'of $1 children');
  res = res.replace(/\bSatu indikator per area, disebut eksplisit\b/g, 'One benchmark indicator per area');
  res = res.replace(/\bJumlah RC terwawancara\b/g, 'Number of interviewed RCs');
  res = res.replace(/\bRentang terendah–tertinggi\b/g, 'Min–max range');
  res = res.replace(/\bgaris oranye = median\b/g, 'orange marker = median');
  res = res.replace(/\brentang min–max\b/g, 'min–max range');
  res = res.replace(/\bJawaban terbuka · (\d+) dari (\d+) RC memberi isi\b/g, 'Open-ended feedback · $1 of $2 RCs responded');
  res = res.replace(/\bJawaban terbuka · (\d+) dari (\d+) RC menyampaikan usulan\b/g, 'Open-ended feedback · $1 of $2 RCs made suggestions');
  res = res.replace(/\bJawaban terbuka\b/g, 'Open-ended feedback');
  res = res.replace(/\bBasis (\d+) RC\b/g, 'Base of $1 RCs');
  res = res.replace(/\bbasis (\d+) RC\b/g, 'base of $1 RCs');
  res = res.replace(/\bMulti-respons · basis (\d+) RC\b/g, 'Multiple responses · base $1 RCs');
  res = res.replace(/\bPilihan tunggal · basis (\d+) RC\b/g, 'Single choice · base $1 RCs');
  res = res.replace(/\bPertanyaan sensitif · basis (\d+) RC\b/g, 'Sensitive question · base $1 RCs');
  res = res.replace(/\bPersepsi RC · basis (\d+) RC\b/g, 'RC perception · base $1 RCs');
  res = res.replace(/\bSkala 1–5 · basis (\d+) RC\b/g, 'Scale 1–5 · base $1 RCs');
  res = res.replace(/\bSkala 1\u20135 · basis (\d+) RC\b/g, 'Scale 1–5 · base $1 RCs');
  res = res.replace(/\bJumlah RC · multi-respons\b/g, 'Number of RCs · multiple responses');
  res = res.replace(/\bJumlah RC · basis (\d+) RC\b/g, 'Number of RCs · base $1 RCs');
  res = res.replace(/\btanpa jawaban\b/g, 'unanswered');
  res = res.replace(/\bth\b/g, 'yo');
  res = res.replace(/\borang\b/g, 'people');
  res = res.replace(/\banak\b/g, 'children');

  for(const [pattern,replacement] of englishPatterns) res=res.replace(pattern,replacement);
  return res;
}

export function trTableHead(headHtml){
  if(currentLang !== 'en' || !headHtml) return headHtml;
  let h = headHtml;
  const thMap = {
    "AP": "PA",
    "Area Program": "Program Area",
    "Rentang (Rp 0 – 2,8 jt)": "Range (IDR 0 – 2.8M)",
    "Rentang (Rp 0 \u2013 2,8 jt)": "Range (IDR 0 – 2.8M)",
    "Min": "Min",
    "Median": "Median",
    "Max": "Max",
    "RC": "RCs",
    "Anak<br>P": "Child<br>F",
    "Anak<br>L": "Child<br>M",
    "Median usia<br>anak (th)": "Median age<br>child (yo)",
    "KK ≤ SD": "HoH ≤ Primary",
    "KK \u2264 SD": "HoH ≤ Primary",
    "Rumah milik<br>sendiri": "Own<br>house",
    "RT<br>disabilitas": "HH with<br>disability",
    "Rata-rata<br>anggota RT": "Avg HH<br>members",
    "Kategori": "Category",
    "Jumlah": "Count",
    "Persentase": "Percentage",
    "Sumber": "Source",
    "Channel": "Channel",
    "Pilihan": "Choice",
    "Alasan": "Reason"
  };
  for(const [k,v] of Object.entries(thMap)){
    h = h.split('<th>'+k+'</th>').join('<th>'+v+'</th>');
    h = h.split('<th class="n">'+k+'</th>').join('<th class="n">'+v+'</th>');
    h = h.split('<th class="ctr">'+k+'</th>').join('<th class="ctr">'+v+'</th>');
  }
  return h.replace(/(<th\b[^>]*>)([\s\S]*?)(<\/th>)/g,(_,a,text,b)=>a+tr(text)+b);
}


export function translateUI(root){
  if(currentLang!=='en') return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) if(!walker.currentNode.parentElement.closest('.vb')) nodes.push(walker.currentNode);
  for(const node of nodes){
    const text=node.textContent, trimmed=text.trim();
    if(trimmed) node.textContent=text.replace(trimmed,tr(trimmed));
  }
}
