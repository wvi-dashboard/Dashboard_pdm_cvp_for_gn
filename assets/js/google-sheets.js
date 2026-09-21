const q={
  old:'A. DEMOGRAFI RESPONDEN/Apakah Anda/anak Anda pernah menerima GN dari WVI SEBELUM tahun 2025 (dengan metode lama — bantuan barang/gift langsung)?',
  amount:'D. PROSES DISTRIBUSI/Berapa jumlah dana GN yang Anda terima? (IDR)'
};

export function parseCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],next=text[i+1];
    if(c==='"'&&quoted&&next==='"'){cell+='"';i++;}
    else if(c==='"') quoted=!quoted;
    else if(c===','&&!quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){
      if(c==='\r'&&next==='\n') i++;
      row.push(cell);if(row.some(v=>v!=='')) rows.push(row);row=[];cell='';
    }else cell+=c;
  }
  if(cell||row.length){row.push(cell);rows.push(row);}
  return rows;
}

const clean=v=>String(v??'').trim();
const yes=v=>['1','true','ya','yes'].includes(clean(v).toLowerCase());
const num=v=>{const s=clean(v).replace(/[^0-9.-]/g,'');const n=Number(s);return s&&Number.isFinite(n)?n:null;};
const text=v=>clean(v);
const normalizeFsp=value=>/^(BNI|BRI|Mandiri)$/i.test(value)?'Bank '+value:value;
const selected=(get,items)=>items.filter(([,header])=>yes(get(header))).map(([label])=>label);
const fiscalYear=value=>{
  const raw=clean(value);let year,month;
  let match=raw.match(/^(\d{4})[-/]([01]?\d)/);
  if(match){year=Number(match[1]);month=Number(match[2]);}
  else if((match=raw.match(/^([01]?\d)\/(?:[0-3]?\d)\/(\d{4})/))){month=Number(match[1]);year=Number(match[2]);}
  else return '';
  return String(month>=10?year+1:year);
};
const isoDate=value=>{
  const raw=clean(value);let match=raw.match(/^(\d{4})[-/]([01]?\d)[-/]([0-3]?\d)/);
  if(match) return `${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
  match=raw.match(/^([01]?\d)\/([0-3]?\d)\/(\d{4})/);
  return match?`${match[3]}-${match[1].padStart(2,'0')}-${match[2].padStart(2,'0')}`:'';
};

export function rowsToDataset(rows,entry){
  if(rows.length<2) throw new Error('Google Sheet tidak memiliki baris data.');
  const headers=rows[0].map(clean),index=new Map(headers.map((h,i)=>[h,i]));
  const required=['Nama AP',q.old,q.amount,'Tanggal Submit'];
  for(const header of required) if(!index.has(header)) throw new Error('Kolom Google Sheet tidak ditemukan: '+header);
  const records=[];
  for(const [offset,row] of rows.slice(1).entries()){
    const get=header=>row[index.get(header)]??'';
    if((!clean(get('Nama AP'))&&!clean(get('_uuid'))&&!clean(get('_id')))||clean(get('A. DEMOGRAFI RESPONDEN/Apakah Anda menerima GN dari WVI?'))!=='Ya') continue;
    const dana=num(get(q.amount));
    const prefRaw=(get('B. PENYEDIAAN INFORMASI/Bagaimana sebaiknya Anda menerima informasi?')+' '+get('B. PENYEDIAAN INFORMASI/Sebutkan lainnya')).toLowerCase();
    const submit=get('Tanggal Submit')||get('tanggal_submit')||get('start')||get('_submission_time');
    const pakai=selected(get,[
      ['Pangan pokok','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pangan pokok'],
      ['Pangan baduta','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pangan Baduta'],
      ['Pangan ibu hamil/menyusui','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pangan ibu hamil/menyusui'],
      ['Air','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Air'],
      ['Kebersihan','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Kebersihan'],
      ['Tempat tinggal','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Tempat tinggal'],
      ['Kesehatan RT','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Kesehatan RT'],
      ['Kesehatan (berobat)','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Kesehatan (berobat)'],
      ['BPJS','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/BPJS'],
      ['Transportasi','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Transportasi'],
      ['Komunikasi','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Komunikasi'],
      ['Pendidikan anak','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pendidikan anak'],
      ['Pakaian','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pakaian'],
      ['Alas kaki','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Alas kaki'],
      ['Penghematan','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Penghematan'],
      ['Bayar utang','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Bayar utang'],
      ['Tabungan','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Tabungan'],
      ['Mainan anak','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Mainan anak'],
      ['Perabot RT','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Perabot RT'],
      ['Listrik','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Listrik'],
      ['Pulsa','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Pulsa'],
      ['Emas','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Emas'],
      ['Lainnya','E. PENGGUNAAN BANTUAN TUNAI/Uang GN digunakan untuk kebutuhan apa saja?/Lainnya']
    ]);
    const unmet=selected(get,[
      ['Pangan dasar','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Pangan dasar'],
      ['Pangan baduta','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Pangan Baduta'],
      ['Pangan bumil/busui','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Pangan bumil/busui'],
      ['Air','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Air'],
      ['Kebersihan','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Kebersihan'],
      ['Rumah','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Rumah'],
      ['Kesehatan','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Kesehatan'],
      ['Transport','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Transport'],
      ['Komunikasi','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Komunikasi'],
      ['Pendidikan','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Pendidikan'],
      ['Pakaian','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Pakaian'],
      ['Lainnya','E. PENGGUNAAN BANTUAN TUNAI/Kebutuhan dasar apa yang TIDAK dapat dipenuhi?/Lainnya']
    ]);
    const fspRaw=text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Penyedia jasa keuangan (FSP) mana yang Anda gunakan untuk mencairkan GN?'));
    records.push({
      ap:text(get('Nama AP')).replace(/-\d{5}$/,''),dana,danaOk:dana!==null&&dana>=100000,
      info6:[43,47,45,42,46,44].map(i=>yes(row[i])),infoCukup:text(get('B. PENYEDIAAN INFORMASI/Apakah Anda menerima INFORMASI yang cukup tentang GN selama proses?')),
      srcStaf:yes(get('B. PENYEDIAAN INFORMASI/Darimana Anda mendapat informasi tersebut?/Staf WVI')),
      srcKader:yes(get('B. PENYEDIAAN INFORMASI/Darimana Anda mendapat informasi tersebut?/kader_pa'))||yes(get('B. PENYEDIAAN INFORMASI/Darimana Anda mendapat informasi tersebut?/Kader perlindungan anak'))||/kader|pji|pendamping/i.test(get('B. PENYEDIAAN INFORMASI/Darimana Anda mendapat informasi tersebut?')),
      prefStaf:yes(get('B. PENYEDIAAN INFORMASI/Bagaimana sebaiknya Anda menerima informasi?/Langsung staff')),
      prefKader:/kader|pji|pendamping/.test(prefRaw),prefTelp:yes(get('B. PENYEDIAAN INFORMASI/Bagaimana sebaiknya Anda menerima informasi?/Telepon/SMS')),
      prefSos:yes(get('B. PENYEDIAAN INFORMASI/Bagaimana sebaiknya Anda menerima informasi?/Sosial media')),prefCetak:yes(get('B. PENYEDIAAN INFORMASI/Bagaimana sebaiknya Anda menerima informasi?/Cetak (pamflet/leaflet)')),
      fsp:normalizeFsp(fspRaw==='Lainnya'?(text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Jika lainnya, sebutkan nama FSP'))||fspRaw):fspRaw),
      serah:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Siapa yang menyerahkan GN kepada Anda?')),serahLain:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Lainnya')),
      harusDatang:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Apakah Anda harus datang ke kantor ${fsp_used} untuk menerima GN?')),
      tatacara:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Apakah Anda dapat informasi tata cara pengambilan dana di ${fsp_used}?')),
      pernahFsp:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Apakah keluarga Anda sebelumnya pernah menggunakan layanan ${fsp_used} untuk pengiriman/penerimaan uang?')),
      difasilitasi:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Bila Ya, apakah Anda difasilitasi (transport/pendamping) untuk pengambilan?')),
      proses:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Bagaimana proses pemberian GN melalui ${fsp_used}?')),
      kesulitan:selected(get,[['Jarak jauh','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Jarak jauh'],['Jadwal bentrok','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Jadwal bentrok'],['Jadwal molor','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Jadwal molor'],['Antrian panjang','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Antrian panjang'],['Info tidak jelas','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Info tidak jelas'],['Tidak ada transport','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Tidak ada transport'],['Tidak ada pengantar','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Tidak ada pengantar'],['Lainnya','C. PENYEDIA JASA KEUANGAN (FSP)/Bila sulit, hal-hal yang menyulitkan?/Lainnya']]),
      kesulitanLain:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Sebutkan lainnya')),potongan:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Apakah ada biaya admin/potongan yang dikenakan oleh ${fsp_used}?')),potJml:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Jika ya, berapa jumlah potongan? (IDR)')),
      jarak:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Berapa kira-kira jarak rumah Anda ke kantor ${fsp_used} terdekat? (km)')),kunjungan:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Berapa kali Anda harus datang ke ${fsp_used} untuk menyelesaikan pencairan?')),jam:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Berapa total waktu yang Anda habiskan (jam) dari berangkat sampai pulang ke rumah untuk pencairan GN?')),trans:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Berapa total biaya transport PP yang Anda keluarkan untuk pencairan? (IDR)')),hilang:text(get('C. PENYEDIA JASA KEUANGAN (FSP)/Apakah Anda kehilangan kesempatan bekerja/pendapatan saat harus datang ke ${fsp_used}?')),hilangRp:num(get('C. PENYEDIA JASA KEUANGAN (FSP)/Jika ya, kira-kira berapa estimasi pendapatan yang hilang? (IDR)')),
      lokasi:text(get('D. PROSES DISTRIBUSI/Di mana Anda menerima GN?')),lokasiSesuai:text(get('D. PROSES DISTRIBUSI/Apakah lokasi sesuai informasi awal?')),aman:text(get('D. PROSES DISTRIBUSI/Apakah Anda merasa aman saat proses distribusi?')),hormat:text(get('D. PROSES DISTRIBUSI/Apakah Anda diperlakukan dengan hormat oleh staf WVI/${fsp_used}?')),waktuInfo:text(get('D. PROSES DISTRIBUSI/Kapan Anda menerima informasi bahwa uang GN sudah bisa diambil?')),waktuLain:text(row[100]),
      danaSesuai:text(get('D. PROSES DISTRIBUSI/Apakah dana yang diterima sesuai dengan yang diinformasikan?')),danaAlasan:text(get('D. PROSES DISTRIBUSI/Jika tidak sesuai, apa penyebabnya?')),danaAlasanLain:text(row[104]),kepFsp:text(get('D. PROSES DISTRIBUSI/Apakah Anda puas dengan pelayanan FSP (${fsp_used})?')),
      fspTdkPuas:selected(get,[['Jarak jauh','D. PROSES DISTRIBUSI/Jika biasa/tidak puas, mengapa?/Jarak jauh'],['Biaya transport','D. PROSES DISTRIBUSI/Jika biasa/tidak puas, mengapa?/Biaya transport'],['Antrian panjang','D. PROSES DISTRIBUSI/Jika biasa/tidak puas, mengapa?/Antrian panjang'],['Persyaratan sulit','D. PROSES DISTRIBUSI/Jika biasa/tidak puas, mengapa?/Persyaratan sulit'],['Pelayanan tidak ramah','D. PROSES DISTRIBUSI/Jika biasa/tidak puas, mengapa?/Pelayanan tidak ramah']]),caraPref:text(get('D. PROSES DISTRIBUSI/Cara penyaluran GN yang lebih tepat menurut Anda?')),caraPrefLain:text(get('D. PROSES DISTRIBUSI/Sebutkan lainnya')),
      dominan:text(get('E. PENGGUNAAN BANTUAN TUNAI/Siapa yang paling dominan memutuskan penggunaan dana?')),prioritas:text(get('E. PENGGUNAAN BANTUAN TUNAI/Siapa prioritas penggunaan dana GN?')),pakai,pakaiLain:text(row[140]),terlarang:text(get('E. PENGGUNAAN BANTUAN TUNAI/Apakah ada pembelian rokok/kosmetik/minuman beralkohol dari dana GN?')),kemampuan:text(get('E. PENGGUNAAN BANTUAN TUNAI/Sejauh mana dana GN dapat memenuhi kebutuhan dasar RT Anda?')),unmetAda:unmet.length>0,unmet,unmetAlasan:text(get('E. PENGGUNAAN BANTUAN TUNAI/Mengapa kebutuhan tersebut tidak terpenuhi?')),
      belanja:selected(get,[['Toko','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Toko'],['Kios/warung','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Kios/warung'],['Pasar tradisional','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Pasar tradisional'],['Pusat perbelanjaan','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Pusat perbelanjaan'],['Online','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Online'],['Minimarket','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Minimarket'],['Supermarket','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Supermarket'],['Mall','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Mall'],['Lainnya','E. PENGGUNAAN BANTUAN TUNAI/Bagaimana belanja dari dana GN?/Lainnya']]),sulitBelanja:text(get('E. PENGGUNAAN BANTUAN TUNAI/Apakah mudah membelanjakan dana GN?')),harga:text(get('E. PENGGUNAAN BANTUAN TUNAI/Bagaimana harga barang di pasar saat ini?')),sedia:text(get('E. PENGGUNAAN BANTUAN TUNAI/Bagaimana ketersediaan barang sehari-hari?')),batasan:text(get('E. PENGGUNAAN BANTUAN TUNAI/Apakah ada kebutuhan penting yang ingin Anda beli untuk anak/keluarga tapi TIDAK BOLEH menurut aturan WVI?')),batasanItem:text(get('E. PENGGUNAAN BANTUAN TUNAI/Jika ya, sebutkan kebutuhan yang dimaksud')),
      sesuaiKebutuhan:text(get('F. KEPUASAN/Apakah bantuan sesuai kebutuhan anak/keluarga?')),kepuasan:text(get('F. KEPUASAN/Secara keseluruhan, puaskah Anda dengan program GN?')),puasAlasan:selected(get,[['Jumlah cukup','F. KEPUASAN/Alasan sangat puas/puas?/Jumlah cukup'],['Proses cepat','F. KEPUASAN/Alasan sangat puas/puas?/Proses cepat'],['Persyaratan mudah','F. KEPUASAN/Alasan sangat puas/puas?/Persyaratan mudah'],['Lainnya','F. KEPUASAN/Alasan sangat puas/puas?/Lainnya']]),tdkPuasAlasan:selected(get,[['Jumlah kurang','F. KEPUASAN/Alasan biasa/tidak puas?/Jumlah kurang'],['Proses lama','F. KEPUASAN/Alasan biasa/tidak puas?/Proses lama'],['Persyaratan banyak','F. KEPUASAN/Alasan biasa/tidak puas?/Persyaratan banyak'],['Lainnya','F. KEPUASAN/Alasan biasa/tidak puas?/Lainnya']]),bantuanLain:text(get('F. KEPUASAN/Adakah organisasi/pihak lain yang membantu Anda?')),bantuanDetail:text(get('F. KEPUASAN/Jika ya, sebutkan dari siapa, bentuk, jumlah')),timbal:text(get('F. KEPUASAN/Apakah ada pihak yang meminta jasa timbal balik?')),
      lama:text(get(q.old)),bKecepatan:text(get('G. PERBANDINGAN MODALITAS/Dibanding GN yang dulu (bantuan barang/gift langsung dari staff), bagaimana KECEPATAN proses CVP sekarang?')),bPilihan:text(get('G. PERBANDINGAN MODALITAS/Bagaimana PILIHAN/FLEKSIBILITAS sekarang dibanding dulu?')),bDignity:text(get('G. PERBANDINGAN MODALITAS/Bagaimana PRIVASI/MARTABAT sekarang dibanding dulu?')),bKemudahan:text(get('G. PERBANDINGAN MODALITAS/Bagaimana KEMUDAHAN proses sekarang dibanding dulu?')),bOverall:text(get('G. PERBANDINGAN MODALITAS/Secara keseluruhan, mana yang Anda lebih suka?')),bAlasan:text(get('G. PERBANDINGAN MODALITAS/Mengapa Anda memilih jawaban tersebut?')),
      infoProgram:text(get('H. AKUNTABILITAS/Apakah Anda menerima informasi umum tentang program WVI?')),mekAda:text(get('H. AKUNTABILITAS/Apakah mekanisme feedback/komplain WVI tersedia?')),mekPakai:text(get('H. AKUNTABILITAS/Apakah Anda/keluarga menggunakan mekanisme tersebut?')),kepKomplain:text(get('H. AKUNTABILITAS/Seberapa puas penyelesaian komplain?')),
      komplPref:(()=>{const items=selected(get,[['Langsung ke staf WVI','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Langsung staf WVI'],['Pemerintah Desa','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Pemerintah Desa'],['Kader Posyandu','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Kader Posyandu'],['Tokoh masyarakat','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Tokoh masyarakat'],['SMS aduan','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/SMS aduan'],['Telepon WVI','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Telepon WVI'],['Kotak suara','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Kotak suara'],['Pertemuan dusun','H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Pertemuan dusun']]);const other=text(get('H. AKUNTABILITAS/Jika lainnya, jelaskan'));if(/kader|pji|pendamping/i.test(other))items.push('Kader / PJI / pendamping');else if(yes(get('H. AKUNTABILITAS/Bagaimana Anda lebih suka mengajukan keluhan?/Lainnya')))items.push('Lainnya');return items;})(),
      usiaAnak:num(get('A. DEMOGRAFI RESPONDEN/Usia Anak')),jkAnak:text(get('A. DEMOGRAFI RESPONDEN/Jenis Kelamin Anak')),jkResp:text(get('A. DEMOGRAFI RESPONDEN/Jenis kelamin responden')),isKk:text(get('A. DEMOGRAFI RESPONDEN/Apakah Anda kepala keluarga?')),jkKk:text(get('A. DEMOGRAFI RESPONDEN/Jenis kelamin kepala keluarga')),pendKk:text(get('A. DEMOGRAFI RESPONDEN/Pendidikan terakhir KK')),disab:text(get('A. DEMOGRAFI RESPONDEN/Apakah ada anggota keluarga disabilitas?')),rumah:text(get('A. DEMOGRAFI RESPONDEN/Status tempat tinggal')),anggota:num(get('A. DEMOGRAFI RESPONDEN/Jumlah anggota keluarga/total_anggota_keluarga')),
      ubah:text(get('I. PENUTUP — REKOMENDASI RESPONDEN/Jika Anda bisa mengubah SATU HAL dari proses pemberian GN ini, apa yang akan Anda ubah?')),baik:text(get('I. PENUTUP — REKOMENDASI RESPONDEN/Apa yang menurut Anda PALING BAIK dari proses pemberian GN saat ini?')),sekolah:text(get('A. DEMOGRAFI RESPONDEN/Status sekolah anak saat ini')),usiaResp:num(get('A. DEMOGRAFI RESPONDEN/Usia responden')),hubKk:text(get('A. DEMOGRAFI RESPONDEN/Jika bukan KK, hubungan dengan KK'))||null,usiaKk:num(get('A. DEMOGRAFI RESPONDEN/Usia kepala keluarga')),angg018:num(get('A. DEMOGRAFI RESPONDEN/Jumlah anggota keluarga/Jumlah anggota keluarga usia 0-18 tahun')),anggDws:num(get('A. DEMOGRAFI RESPONDEN/Jumlah anggota keluarga/Jumlah anggota keluarga usia >18 tahun')),anggKerja:num(get('A. DEMOGRAFI RESPONDEN/Jumlah anggota keluarga/Jumlah anggota keluarga yang berpenghasilan')),anggHamil:num(get('A. DEMOGRAFI RESPONDEN/Jumlah anggota keluarga/Jumlah anggota keluarga yang hamil')),
      disJenis:selected(get,[['Melihat','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Melihat'],['Mendengar','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Mendengar'],['Berjalan','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Berjalan'],['Mengingat','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Mengingat'],['Mengurus diri','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Mengurus diri'],['Berkomunikasi','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Berkomunikasi'],['Lainnya','A. DEMOGRAFI RESPONDEN/Sebutkan jenis kebutuhan khusus/Lainnya']]),
      id:'sheet-'+(text(get('_uuid'))||text(get('_id'))||String(offset+1)),fy:fiscalYear(submit),submittedAt:text(submit)
    });
  }
  const dates=records.map(r=>isoDate(r.submittedAt)).filter(Boolean).sort();
  return {schemaVersion:1,id:entry.id,cycle:entry.cycle||'2026–2027',updatedAt:dates.at(-1)||new Date().toISOString().slice(0,10),source:entry.sourceUrl||'Google Sheets',label:entry.label,credits:entry.credits||[],records,live:true};
}

export async function loadGoogleSheet(entry,signal){
  const params=new URLSearchParams({format:'csv',gid:String(entry.googleSheet.gid),_:String(Date.now())});
  const url=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(entry.googleSheet.spreadsheetId)}/export?${params}`;
  const response=await fetch(url,{signal,cache:'no-store'});
  if(!response.ok) throw new Error(`Google Sheet gagal dimuat (HTTP ${response.status}).`);
  return rowsToDataset(parseCSV(await response.text()),entry);
}
