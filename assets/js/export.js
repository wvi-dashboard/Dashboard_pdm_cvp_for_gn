const headers = {
  en:['Program Area','Disbursed Amount (IDR)','Data Quality Status','Info Adequacy','FSP','Distribution Process','Has Deduction','Deduction Amount','Distance (km)','Visits','Travel Time (hrs)','Transport Cost','Met Needs','Program Satisfaction','FSP Satisfaction','Child Age','Child Gender','Respondent Gender','HoH Gender','HoH Education','Disability in HH','Housing Status','Household Size'],
  id:['Area Program','Dana Diterima','Status Kualitas Data','Kecukupan Info','FSP','Proses Distribusi','Ada Potongan','Jumlah Potongan','Jarak (km)','Kunjungan','Waktu Tempuh (jam)','Biaya Transportasi','Sesuai Kebutuhan','Kepuasan Program','Kepuasan FSP','Usia Anak','JK Anak','JK Responden','JK KK','Pendidikan KK','Disabilitas RT','Status Rumah','Jumlah Anggota RT']
};

const cell = value=>'"'+String(value??'').replace(/"/g,'""')+'"';

export function buildCSV(records,lang='id'){
  const isEn=lang==='en';
  const rows=records.map(r=>[
    r.ap,r.dana,r.danaOk?'Valid':(isEn?'Flagged for review':'Perlu verifikasi'),r.infoCukup,
    r.fsp,r.proses,r.potongan,r.potJml,r.jarak,r.kunjungan,r.jam,r.trans,
    r.sesuaiKebutuhan,r.kepuasan,r.kepFsp,r.usiaAnak,r.jkAnak,r.jkResp,r.jkKk,
    r.pendKk,r.disab,r.rumah,r.anggota
  ]);
  return '\uFEFF'+[headers[isEn?'en':'id'],...rows].map(row=>row.map(cell).join(',')).join('\r\n');
}

export function exportFilename(datasetId,area,date=new Date()){
  const safe=value=>String(value).replace(/[^a-zA-Z0-9_-]/g,'_');
  return `PDM_CVP_GN_${safe(datasetId)}_${safe(area||'Semua_AP')}_${date.toISOString().slice(0,10)}.csv`;
}
