import {esc,dec,of_,pctS} from './format.js';
export function med(a){a=a.slice().sort((x,y)=>x-y);if(!a.length)return null;const m=a.length>>1;
  return a.length%2?a[m]:(a[m-1]+a[m])/2;}
export const C = (rows,f)=>rows.filter(f).length;
export function dist(rows,key,order){
  const m=Object.create(null); rows.forEach(r=>{const v=r[key]; if(v) m[v]=(m[v]||0)+1;});
  const ks = order? [...new Set([...order,...Object.keys(m)])] : Object.keys(m).sort((a,b)=>m[b]-m[a]);
  return ks.map(k=>({k:k,v:m[k]||0}));
}
export function multi(rows,key,labels){
  const out = [...new Set([...labels,...rows.flatMap(r=>r[key]||[])])].map(l=>({k:l,v:rows.filter(r=>(r[key]||[]).indexOf(l)>=0).length}));
  return out.sort((a,b)=>b.v-a.v);
}
export function byAp(rows){
  const m=new Map();
  rows.forEach(r=>{ if(!m.has(r.ap)) m.set(r.ap,[]); m.get(r.ap).push(r); });
  return [...m.entries()].sort((a,b)=>b[1].length-a[1].length || a[0].localeCompare(b[0]));
}
export const SUBLBL=['Informasi lokasi distribusi','Dokumen yang dibutuhkan untuk pencairan',
  'Batasan barang yang boleh dibeli','Nilai cash GN yang akan diterima',
  'Kertas rencana belanja','Tahapan pencairan'];
export const SUBSHORT=['Lokasi<br>distribusi','Dokumen<br>pencairan','Batasan<br>barang',
  'Nilai cash<br>GN','Kertas rencana<br>belanja','Tahapan<br>pencairan'];
export const KEP5=['Sangat Puas','Puas','Biasa','Tidak Puas','Sangat Tidak Puas'];
export const KEPVAL={'Sangat Tidak Puas':1,'Tidak Puas':2,'Biasa':3,'Puas':4,'Sangat Puas':5};
export const NOSUG=/^(tidak\s*ada|tidak\s*tau|tidak\s*tahu|tidak\s*perlu|tidak$|sudah\s+(baik|bagus|sangat|berjalan)|untuk saat ini tidak|tidak ada yang)/i;
export function noSugCount(rows,key){
  return rows.filter(r=>{const t=(r[key]||'').trim(); return !t || (key==='ubah' && NOSUG.test(t));}).length;
}
export const SEKOLAH=[['Balita','Balita / belum sekolah'],['PAUD','PAUD'],['TK','TK'],
  ['SD/sederajat','SD / sederajat'],['SMP/sederajat','SMP / sederajat'],
  ['SMA/sederajat','SMA / sederajat'],['Putus Sekolah','Putus sekolah']];
export const PENDKK=['Tidak/belum sekolah','SD','SMP','SMA','Perguruan Tinggi'];
export const RUMAHST=['Milik sendiri','Kontrak','Menumpang','Lainnya'];
export const DISJEN=['Melihat','Mendengar','Berjalan','Mengingat','Mengurus diri','Berkomunikasi','Lainnya'];
export const UKEL=[['0\u20135 th',0,5],['6\u201311 th',6,11],['12\u201314 th',12,14],['15\u201318 th',15,18]];

export const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
export const rng = a => a.length ? Math.min(...a)+'\u2013'+Math.max(...a) : '\u2014';


export function calculate_page_demografi(R){
  const n=R.length;

  const aP=C(R,r=>r.jkAnak==='Perempuan'), aL=C(R,r=>r.jkAnak==='Laki-laki');
  const ua=R.map(r=>r.usiaAnak).filter(v=>v!=null);
  const uaBars=UKEL.map(([l,lo,hi])=>{
    const v=C(R,r=>r.usiaAnak!=null && r.usiaAnak>=lo && r.usiaAnak<=hi);
    return {k:l,v:v,lbl:of_(v,n)};
  });
  const skBars=SEKOLAH.map(([k,l])=>{
    const v=C(R,r=>r.sekolah===k);
    return {k:l,v:v,cls:(k==='Putus Sekolah'?'dk':''),lbl:of_(v,n)};
  });
  const sekNA=C(R,r=>!r.sekolah);

  const rP=C(R,r=>r.jkResp==='Perempuan'), rL=C(R,r=>r.jkResp==='Laki-laki');
  const kP=C(R,r=>r.jkKk==='Perempuan'),  kL=C(R,r=>r.jkKk==='Laki-laki');
  const ur=R.map(r=>r.usiaResp).filter(v=>v!=null);
  const uk=R.map(r=>r.usiaKk).filter(v=>v!=null);
  const jkBars=[
    {k:'Responden \u2014 Perempuan',v:rP,lbl:of_(rP,n)},
    {k:'Responden \u2014 Laki-laki',v:rL,cls:'l',lbl:of_(rL,n)},
    {k:'Kepala keluarga \u2014 Perempuan',v:kP,cls:'dk',lbl:of_(kP,n)},
    {k:'Kepala keluarga \u2014 Laki-laki',v:kL,cls:'ll',lbl:of_(kL,n)}
  ];

  const hSelf=C(R,r=>r.isKk==='Ya');
  const hMap={};
  R.filter(r=>r.isKk!=='Ya').forEach(r=>{
    const k=r.hubKk || 'Tidak diisi (skip logic)';
    hMap[k]=(hMap[k]||0)+1;
  });
  const hubBars=[{k:'Kepala keluarga (responden sendiri)',v:hSelf,cls:'dk',lbl:of_(hSelf,n)}]
    .concat(Object.keys(hMap).sort((a,b)=>hMap[b]-hMap[a]).map(k=>({
      k:esc(k),v:hMap[k],
      cls:(k.indexOf('Tidak diisi')===0?'g':''),
      lbl:of_(hMap[k],n)})));
  const hubNA=Object.keys(hMap).filter(k=>k.indexOf('Tidak diisi')===0)
    .reduce((a,k)=>a+hMap[k],0);

  const pdBars=PENDKK.map(k=>{
    const v=C(R,r=>r.pendKk===k);
    return {k:k,v:v,cls:(k==='Tidak/belum sekolah'?'dk':''),lbl:of_(v,n)};
  });
  const pdLow=C(R,r=>r.pendKk==='Tidak/belum sekolah'||r.pendKk==='SD');

  const tot=R.map(r=>r.anggota).filter(v=>v!=null);
  const a18=R.map(r=>r.angg018).filter(v=>v!=null);
  const adw=R.map(r=>r.anggDws).filter(v=>v!=null);
  const keOk=R.filter(r=>r.anggKerja!=null && r.anggDws!=null && r.anggKerja<=r.anggDws)
              .map(r=>r.anggKerja);
  const keDq=C(R,r=>r.anggKerja!=null && r.anggDws!=null && r.anggKerja>r.anggDws);
  const rmBars=RUMAHST.map(k=>{
    const v=C(R,r=>r.rumah===k);
    return {k:k,v:v,cls:(k==='Lainnya'?'l':(k==='Menumpang'?'dk':'')),lbl:of_(v,n)};
  });

  const dRow=R.filter(r=>r.disab==='Ya'), dYa=dRow.length;
  const dTdk=C(R,r=>r.disab==='Tidak');
  const dBars=DISJEN.map(k=>{
    const v=dRow.filter(r=>(r.disJenis||[]).indexOf(k)>=0).length;
    return {k:k,v:v,lbl:String(v)};
  });


  return {n,aP,aL,ua,uaBars,skBars,sekNA,rP,rL,kP,kL,ur,uk,jkBars,hSelf,hMap,hubBars,hubNA,pdBars,pdLow,tot,a18,adw,keOk,keDq,rmBars,dRow,dYa,dTdk,dBars};
}

export function calculate_pg1(R){
  const n=R.length, aps=byAp(R);
  const dOk=R.filter(r=>r.danaOk).map(r=>r.dana);
  const bad=C(R,r=>r.dana!=null && !r.danaOk);
  const kv5=R.map(r=>KEPVAL[r.kepuasan]).filter(x=>x);
  const mean = kv5.length? dec(kv5.reduce((a,b)=>a+b,0)/kv5.length,1) : '—';
  const info6all=C(R,r=>r.info6.every(Boolean));
  const kepFspPos=C(R,r=>r.kepFsp==='Puas'||r.kepFsp==='Sangat Puas');
  const danaSes=C(R,r=>r.danaSesuai==='Ya');
  const kemampuanPos=C(R,r=>r.kemampuan==='Semua'||r.kemampuan==='Sebagian besar');
  const kepPos=C(R,r=>r.kepuasan==='Puas'||r.kepuasan==='Sangat Puas');
  const mekAda=C(R,r=>r.mekAda==='Ya');


  return {n,aps,dOk,bad,kv5,mean,info6all,kepFspPos,danaSes,kemampuanPos,kepPos,mekAda};
}

export function calculate_pg2(R){
  const n=R.length, aps=byAp(R);
  const cnt6=SUBLBL.map((_,ix)=>C(R,r=>r.info6[ix]));
  const all6=C(R,r=>r.info6.every(Boolean));
  const order=cnt6.map((v,ix)=>({v:v,ix:ix})).sort((a,b)=>b.v-a.v);
  const fn=order.map(o=>({k:SUBLBL[o.ix],v:o.v,n:o.v+'/'+n,w:n?o.v/n*100:0}))
    .concat([{k:'LENGKAP SEMUA 6 SUB-ITEM',v:all6,n:all6+'/'+n,w:n?all6/n*100:0,cls:'f4'}]);


  return {n,aps,cnt6,all6,order,fn};
}

export function calculate_pg3(R){
  const n=R.length, aps=byAp(R);
  const fspD=dist(R,'fsp');
  const serah=dist(R,'serah');
  const mudah=C(R,r=>r.proses==='Mudah'), sulit=C(R,r=>r.proses==='Sulit');
  const sulitRows=R.filter(r=>r.proses==='Sulit');
  const KESULIT=['Jarak jauh','Jadwal bentrok','Jadwal molor','Antrian panjang','Info tidak jelas',
    'Tidak ada transport','Tidak ada pengantar','Lainnya'];
  const ks=multi(sulitRows,'kesulitan',KESULIT);
  const jarak=R.map(r=>r.jarak).filter(x=>x!=null);
  const kunj=R.map(r=>r.kunjungan).filter(x=>x!=null);
  const jam=R.map(r=>r.jam).filter(x=>x!=null);
  const potYa=C(R,r=>r.potongan==='Ya'), potNo=C(R,r=>r.potongan==='Tidak'),
        potTt=C(R,r=>r.potongan==='Tidak tahu');
  const potVals=R.filter(r=>r.potJml!=null).map(r=>r.potJml);
  const kepD=dist(R,'kepFsp',KEP5);
  const kepMean=(function(){const a=R.map(r=>KEPVAL[r.kepFsp]).filter(x=>x);
    return a.length?dec(a.reduce((x,y)=>x+y,0)/a.length,1):'—';})();
  const tdkPuasRows=R.filter(r=>r.kepFsp==='Biasa'||r.kepFsp==='Tidak Puas'||r.kepFsp==='Sangat Tidak Puas');
  const tp=multi(tdkPuasRows,'fspTdkPuas',['Jarak jauh','Biaya transport','Antrian panjang','Persyaratan sulit','Pelayanan tidak ramah']).filter(x=>x.v>0);


  return {n,aps,fspD,serah,mudah,sulit,sulitRows,KESULIT,ks,jarak,kunj,jam,potYa,potNo,potTt,potVals,kepD,kepMean,tdkPuasRows,tp};
}

export function calculate_pg4(R){
  const n=R.length, aps=byAp(R);
  const WB=['<5 hari','6-10 hari','11-15 hari','>15 hari setelah diinformasikan di awal','Lainnya'];
  const WBL=['&lt; 5 hari','6–10 hari','11–15 hari','&gt; 15 hari','Lainnya'];
  const trAll=R.map(r=>r.trans).filter(x=>x!=null);
  const trZero=trAll.filter(x=>x===0).length;
  const trSus=trAll.filter(x=>x>0&&x<1000);
  const trOk=trAll.filter(x=>x>=1000);
  const tca=R.filter(r=>r.trans!=null&&r.trans>=1000&&r.danaOk).map(r=>r.trans/r.dana*100);
  const hilangRp=R.filter(r=>r.hilang==='Ya'&&r.hilangRp!=null).map(r=>r.hilangRp);
  const CARA=['Bank','Tetap kantor pos','CU/Kopdit','Agen laku pandai (BRILink)','E-wallet (Ovo/Dana)',
    'Voucher','Barang langsung','Lainnya','Tidak menjawab'];
  const caraD=CARA.map(k=>({k:k,v:C(R,r=>r.caraPref===k)}));
  const lokD=dist(R,'lokasi');


  return {n,aps,WB,WBL,trAll,trZero,trSus,trOk,tca,hilangRp,CARA,caraD,lokD};
}

export function calculate_pg5(R){
  const n=R.length;
  const PAKAI=['Pangan pokok','Pangan baduta','Air','Kebersihan','Kesehatan (berobat)','Transportasi',
    'Komunikasi','Pendidikan anak','Pakaian','Alas kaki','Penghematan','Bayar utang','Tabungan',
    'Mainan anak','Perabot RT','Listrik','Pulsa','Lainnya'];
  const UNMET=['Pangan dasar','Pangan baduta','Pangan bumil/busui','Air','Kebersihan','Rumah',
    'Kesehatan','Transport','Komunikasi','Pendidikan','Pakaian','Lainnya'];
  const BELANJA=['Toko','Kios/warung','Pasar tradisional','Pusat perbelanjaan','Online','Minimarket',
    'Supermarket','Mall','Lainnya'];
  const KEM=['Semua','Sebagian besar','Setengah','Kurang dari setengah','Tidak ada'];
  const pk=multi(R,'pakai',PAKAI);
  const unmetRows=R.filter(r=>r.unmetAda);
  const um=multi(unmetRows,'unmet',UNMET);
  const bl=multi(R,'belanja',BELANJA);
  const kem=KEM.map(k=>({k:k,v:C(R,r=>r.kemampuan===k)}));
  const terlarangYa=C(R,r=>r.terlarang==='Ya'), terlarangNo=C(R,r=>r.terlarang==='Tidak');
  const domD=dist(R,'dominan');
  const batasanRows=R.filter(r=>r.batasan==='Ya'&&r.batasanItem);


  return {n,PAKAI,UNMET,BELANJA,KEM,pk,unmetRows,um,bl,kem,terlarangYa,terlarangNo,domD,batasanRows};
}

export function calculate_pg6(R){
  const n=R.length, aps=byAp(R);
  const kepD=dist(R,'kepuasan',KEP5);
  const kv5=R.map(r=>KEPVAL[r.kepuasan]).filter(x=>x);
  const mean=kv5.length?dec(kv5.reduce((a,b)=>a+b,0)/kv5.length,1):'—';
  const kepPos=C(R,r=>r.kepuasan==='Puas'||r.kepuasan==='Sangat Puas');
  const PUASAL=['Jumlah cukup','Proses cepat','Persyaratan mudah','Lainnya'];
  const TDKPUAS=['Jumlah kurang','Proses lama','Persyaratan banyak','Lainnya'];
  const posRows=R.filter(r=>r.kepuasan==='Puas'||r.kepuasan==='Sangat Puas');
  const negRows=R.filter(r=>r.kepuasan==='Biasa'||r.kepuasan==='Tidak Puas'||r.kepuasan==='Sangat Tidak Puas');
  const pa=multi(posRows,'puasAlasan',PUASAL).filter(x=>x.v>0);
  const na=multi(negRows,'tdkPuasAlasan',TDKPUAS).filter(x=>x.v>0);
  const bantuanYa=C(R,r=>r.bantuanLain==='Ya');
  const L=R.filter(r=>r.lama==='Ya'), m=L.length;


  return {n,aps,kepD,kv5,mean,kepPos,PUASAL,TDKPUAS,posRows,negRows,pa,na,bantuanYa,L,m};
}

export function calculate_pg7(R){
  const n=R.length, aps=byAp(R);
  const infoP=C(R,r=>r.infoProgram==='Ya');
  const mekAda=C(R,r=>r.mekAda==='Ya');
  const mekPakai=C(R,r=>r.mekPakai==='Ya');
  const kepOk=C(R,r=>r.mekPakai==='Ya'&&(r.kepKomplain==='Puas'||r.kepKomplain==='Sangat Puas'));
  const KOMPL=['Langsung ke staf WVI','Kader / PJI / pendamping','Kader Posyandu','Telepon WVI',
    'Tokoh masyarakat','SMS aduan','Pemerintah Desa','Kotak suara','Pertemuan dusun'];
  const kp=multi(R,'komplPref',KOMPL);
  const timbalYa=C(R,r=>r.timbal==='Ya');


  return {n,aps,infoP,mekAda,mekPakai,kepOk,KOMPL,kp,timbalYa};
}
