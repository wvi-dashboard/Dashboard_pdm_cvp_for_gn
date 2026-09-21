import {currentLang,tr} from './i18n.js';
import {datasetMeta} from './state.js';
import {esc,nf,dec,rp,of_,pctS} from './format.js';
import {med,C,dist,multi,byAp,SUBLBL,SUBSHORT,KEP5,KEPVAL,NOSUG,noSugCount,SEKOLAH,PENDKK,RUMAHST,DISJEN,UKEL,avg,rng,calculate_page_demografi,calculate_pg1,calculate_pg2,calculate_pg3,calculate_pg4,calculate_pg5,calculate_pg6,calculate_pg7} from './metrics.js';
import {hb,funnel,donut,heatBg} from './charts.js';
import {tbl,kv,card,row,kpi,verbatim,stat,numBars} from './components.js';
function page_demografi(R){
  const {n,aP,aL,ua,uaBars,skBars,sekNA,rP,rL,kP,kL,ur,uk,jkBars,hSelf,hMap,hubBars,hubNA,pdBars,pdLow,tot,a18,adw,keOk,keDq,rmBars,dRow,dYa,dTdk,dBars}=calculate_page_demografi(R);

  const K=kpi([
    {t:'Responden (RC)',v:n,b:'RC terwawancara pada seleksi ini'},
    {t:'Median usia anak',v:(ua.length?dec(med(ua),1):'\u2014')+'<span class="u"> th</span>',
      b:'rentang '+rng(ua)+' th \u00b7 basis '+ua.length+' RC'},
    {t:'Anak perempuan',v:aP,b:pctS(aP,n)+' dari '+n+' RC'},
    {t:'Responden perempuan',v:rP,b:pctS(rP,n)+' dari '+n+' RC'},
    {t:'RT dengan anggota disabilitas',v:dYa,b:pctS(dYa,n)+' dari '+n+' RC'}
  ]);

  const G=[
    card(null,'Jenis kelamin anak penerima','Basis '+n+' anak penerima GN',
      donut(aP,aL,
        'Perempuan <em>('+pctS(aP,n)+')</em>',
        'Laki-laki <em>('+pctS(aL,n)+')</em>',
        'Anak perempuan'),null),

    card(null,'Kelompok usia anak penerima',
      'Median '+(ua.length?dec(med(ua),1):'\u2014')+' th \u00b7 rentang '+rng(ua)+' th',
      hb(uaBars,{max:n}),null),

    card(null,'Status sekolah anak saat ini',
      'Urutan jenjang'+(sekNA?' \u00b7 <span class="dq">'+sekNA+' tanpa jawaban</span>':''),
      hb(skBars,{max:n,tight:true}),null),

    card(null,'Jumlah anak usia 0\u201318 tahun dalam RT',
      'Rata-rata '+(a18.length?dec(avg(a18),1):'\u2014')+' anak per RT',
      hb(numBars(a18,'anak',n),{max:n,tight:true}),null),

    card(null,'Hubungan responden dengan kepala keluarga',
      'Pengambil keputusan rumah tangga'+
      (hubNA?' \u00b7 <span class="dq">'+hubNA+' bukan KK tapi hubungan kosong</span>':''),
      hb(hubBars,{max:n}),null),

    card(null,'Jenis kelamin responden &amp; kepala keluarga',
      'Median usia responden '+(ur.length?dec(med(ur),0):'\u2014')+' th \u00b7 median usia KK '+
      (uk.length?dec(med(uk),0):'\u2014')+' th',
      hb(jkBars,{max:n}),null),

    card(null,'Pendidikan terakhir kepala keluarga',
      pdLow+' dari '+n+' RC \u2014 KK berpendidikan SD atau lebih rendah ('+pctS(pdLow,n)+')',
      hb(pdBars,{max:n}),null),

    card(null,'Ukuran rumah tangga',
      'Rata-rata '+(tot.length?dec(avg(tot),1):'\u2014')+' anggota per RT',
      stat([
        {v:(tot.length?dec(avg(tot),1):'\u2014'),t:'Rata-rata anggota RT'},
        {v:(a18.length?dec(avg(a18),1):'\u2014'),t:'Rata-rata anggota usia 0\u201318 th'},
        {v:(adw.length?dec(avg(adw),1):'\u2014'),t:'Rata-rata anggota usia >18 th'}
      ])+hb(numBars(tot,'orang',n),{max:n,tight:true}),null),

    card(null,'Status tempat tinggal',
      'Kepemilikan rumah yang ditempati RC',
      hb(rmBars,{max:n}),null),

    card(null,'Inklusi &amp; disabilitas',
      'Jenis kebutuhan khusus memakai angka absolut \u2014 penyebut hanya '+dYa+' RT',
      stat([
        {v:dYa,t:'RT dengan anggota disabilitas'},
        {v:pctS(dYa,n),t:'Proporsi dari '+n+' RC'},
        {v:dTdk,t:'RT tanpa anggota disabilitas'}
      ])+hb(dBars,{max:Math.max(1,dYa),tight:true}),null)
  ];

  const apBody=byAp(R).map(([a,rr])=>{
    const nn=rr.length;
    const p=C(rr,r=>r.jkAnak==='Perempuan');
    const u=rr.map(r=>r.usiaAnak).filter(v=>v!=null);
    const g=rr.map(r=>r.anggota).filter(v=>v!=null);
    return '<tr><td>'+esc(a)+'</td>'+
      '<td class="n">'+nn+'</td>'+
      '<td class="n">'+p+'</td>'+
      '<td class="n">'+(nn-p)+'</td>'+
      '<td class="n">'+(u.length?dec(med(u),1):'\u2014')+'</td>'+
      '<td class="n">'+C(rr,r=>r.pendKk==='Tidak/belum sekolah'||r.pendKk==='SD')+'</td>'+
      '<td class="n">'+C(rr,r=>r.rumah==='Milik sendiri')+'</td>'+
      '<td class="n">'+C(rr,r=>r.disab==='Ya')+'</td>'+
      '<td class="n">'+(g.length?dec(avg(g),1):'\u2014')+'</td></tr>';
  }).join('');
  const apCard=card('Tabel A','Profil demografi per Area Program',
    'Angka absolut (n per AP kecil) \u00b7 median usia anak dan rata-rata anggota RT dalam desimal',
    tbl('<tr><th>Area Program</th><th class="n">RC</th><th class="n">Anak<br>P</th>'+
        '<th class="n">Anak<br>L</th><th class="n">Median usia<br>anak (th)</th>'+
        '<th class="n">KK \u2264 SD</th><th class="n">Rumah milik<br>sendiri</th>'+
        '<th class="n">RT<br>disabilitas</th><th class="n">Rata-rata<br>anggota RT</th></tr>',
        apBody),null);

  const dqBox = keDq ?
    '<div class="note"><b>Catatan kualitas data.</b> Kolom <i>jumlah anggota keluarga yang '+
    'berpenghasilan</i> tidak dipakai sebagai indikator pada halaman ini: <b>'+keDq+' dari '+n+
    ' record</b> mencatat jumlah berpenghasilan melebihi jumlah anggota usia &gt;18 tahun '+
    '(pola pengisian = total anggota RT). Rata-rata pada record yang lolos uji: '+
    (keOk.length?dec(avg(keOk),1):'\u2014')+' orang (basis '+keOk.length+' RC). '+
    'Perlu verifikasi lapangan sebelum dilaporkan.</div>' : '';

  return K + '<div class="cv-grid">'+G.join('')+'</div>' + row('r-1',[apCard]) + dqBox;
}

function cover(R){
  const isEn = (currentLang === 'en');
  const h2Text = isEn
    ? '<h2>Cash &amp; Voucher Programming<br>for Gift Notification</h2>'
    : '<h2>Cash &amp; Voucher Programming<br>untuk Gift Notification</h2>';
  const progText = isEn
    ? '<div class="prog">Wahana Visi Indonesia &nbsp;&middot;&nbsp; '+esc(datasetMeta.cycle)+' Cycle</div>'
    : '<div class="prog">Wahana Visi Indonesia &nbsp;&middot;&nbsp; Siklus '+esc(datasetMeta.cycle)+'</div>';

  return '<div class="cover">'
   +'<div class="cv-bg">'
   +'<div class="ring r3"></div><div class="ring r2"></div><div class="ring r1"></div>'
   +'<div class="solid"></div>'
   +'</div>'
   +'<div class="cv-logo-wrapper">'
   +'<img class="cv-logo-img dark" src="wvi-logo-navy.png" alt="Wahana Visi Indonesia" width="1200" height="385">'
   +'<img class="cv-logo-img mono" src="wvi-logo-white.png" alt="Wahana Visi Indonesia" width="1200" height="385">'
   +'</div>'
   +'<div class="cv-main">'
   +'<div class="eyebrow">POST-DISTRIBUTION MONITORING</div><div class="rule"></div>'
   +h2Text
   +progText
   +'</div></div>';
}
function credits(){
  return '<div class="closing-cover">'+
    '<div class="closing-orbit orbit-one"></div><div class="closing-orbit orbit-two"></div>'+
    '<div class="closing-mark"><img src="wvi-logo-navy.png" alt="Wahana Visi Indonesia"></div>'+
    '<div class="copyright">© '+new Date().getFullYear()+' PEARL Lead · Wahana Visi Indonesia</div>'+
  '</div>';
}
/* ================= PAGES 1 - 4 ================= */
function pg1(R){
  const {n,aps,dOk,bad,kv5,mean,info6all,kepFspPos,danaSes,kemampuanPos,kepPos,mekAda}=calculate_pg1(R);

  const K=kpi([
    {t:'Responden (RC)',v:n,b:'RC terwawancara pada seleksi ini'},
    {t:'Area Program',v:new Set(R.map(r=>r.ap)).size,b:'AP dalam seleksi'},
    {t:'Nilai GN median',v:rp(med(dOk)),sm:true,
      b: dOk.length? 'rentang '+rp(Math.min(...dOk))+' – '+rp(Math.max(...dOk))+' · n='+dOk.length : 'tidak ada nilai valid'},
    {t:'Kepuasan program',v:mean+'<span class="u"> / 5</span>',b:'skala 1–5 · n='+kv5.length},
    {t:'Tahu mekanisme komplain',v:mekAda,b:'dari '+n+' RC'}
  ]);

  const areaBars=hb([
    {k:'Area 1 · Informasi lengkap 6/6 sub-item',v:info6all,lbl:pctS(info6all,n)+' <em>'+info6all+'/'+n+'</em>'},
    {k:'Area 2 · Puas/sangat puas pelayanan FSP',v:kepFspPos,lbl:pctS(kepFspPos,n)+' <em>'+kepFspPos+'/'+n+'</em>'},
    {k:'Area 3 · Dana diterima sesuai informasi',v:danaSes,lbl:pctS(danaSes,n)+' <em>'+danaSes+'/'+n+'</em>'},
    {k:'Area 4 · Kebutuhan dasar terpenuhi semua/sebagian besar',v:kemampuanPos,lbl:pctS(kemampuanPos,n)+' <em>'+kemampuanPos+'/'+n+'</em>'},
    {k:'Area 5 · Puas/sangat puas program GN',v:kepPos,lbl:pctS(kepPos,n)+' <em>'+kepPos+'/'+n+'</em>'},
    {k:'Area 6 · Tahu mekanisme feedback/komplain',v:mekAda,lbl:pctS(mekAda,n)+' <em>'+mekAda+'/'+n+'</em>'}
  ],{max:n});

  const ua=R.map(r=>r.usiaAnak).filter(x=>x!=null);
  const ag=R.map(r=>r.anggota).filter(x=>x!=null);
  const profil=kv([
    ['Usia anak penerima', ua.length? 'median '+med(ua)+' th <em>('+Math.min(...ua)+'–'+Math.max(...ua)+')</em>':'—'],
    ['Anak perempuan', C(R,r=>r.jkAnak==='Perempuan')+' / '+n],
    ['Responden perempuan', C(R,r=>r.jkResp==='Perempuan')+' / '+n],
    ['Responden adalah kepala keluarga', C(R,r=>r.isKk==='Ya')+' / '+n],
    ['Kepala keluarga perempuan', C(R,r=>r.jkKk==='Perempuan')+' / '+n],
    ['Pendidikan KK sampai SD', C(R,r=>r.pendKk==='SD'||r.pendKk==='Tidak/belum sekolah')+' / '+n],
    ['Ada anggota keluarga disabilitas', C(R,r=>r.disab==='Ya')+' / '+n],
    ['Rumah milik sendiri', C(R,r=>r.rumah==='Milik sendiri')+' / '+n],
    ['Pernah terima GN modalitas lama', C(R,r=>r.lama==='Ya')+' / '+n],
    ['Jumlah anggota keluarga', ag.length? 'median '+med(ag)+' <em>('+Math.min(...ag)+'–'+Math.max(...ag)+')</em>':'—']
  ]);

  const apBars=hb(aps.map(([a,rr])=>({k:esc(a),v:rr.length})),{tight:true});
  const SC=Math.max(2800000,...dOk);
  const rngRows=[['<b>Nasional</b>',dOk]].concat(aps.map(([a,rr])=>
    [esc(a), rr.filter(r=>r.danaOk).map(r=>r.dana)]))
    .map(([lbl,vals])=>{
      if(!vals.length) return '<tr><td>'+lbl+'</td><td>—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">0</td></tr>';
      const mn=Math.min(...vals), mx=Math.max(...vals), m=med(vals);
      const left=mn/SC*100, w=Math.max(1.5,(mx-mn)/SC*100), mp=m/SC*100;
      return '<tr><td>'+lbl+'</td><td><span class="rng"><i style="left:'+left.toFixed(1)+
        '%;width:'+w.toFixed(1)+'%"></i><u style="left:'+mp.toFixed(1)+'%"></u></span></td>'+
        '<td class="n">'+rp(mn)+'</td><td class="n">'+rp(m)+'</td><td class="n">'+rp(mx)+
        '</td><td class="n">'+vals.length+'</td></tr>';
    }).join('');

  return K
  + row('r-21',[
      card('TABEL 1–11','Indikator penanda per area asesmen','Satu indikator per area, disebut eksplisit · basis '+n+' RC',areaBars),
      card('TABEL 16','Profil responden','Basis '+n+' RC · Household Survey Section A',profil)
    ])
  + row('r-2',[
      card('TABEL 15','Responden terdata per Area Program','Jumlah RC terwawancara · '+aps.length+' AP dalam seleksi',apBars),
      card('TABEL 6','Nilai GN yang diterima per AP','Rentang terendah–tertinggi · garis oranye = median',
        '<div class="sw"><span><i style="background:var(--o-3)"></i>rentang min–max</span><span><i style="background:var(--o)"></i>median</span></div>'
        + tbl('<tr><th>AP</th><th style="width:34%">Rentang (0 – '+rp(SC)+')</th><th class="n">Min</th><th class="n">Median</th><th class="n">Max</th><th class="n">n</th></tr>',rngRows))
    ])
  + row('r-2',[
      card('TABEL 13','"Apa yang menurut Anda PALING BAIK dari proses pemberian GN saat ini?"',
        'Jawaban terbuka · '+(n-noSugCount(R,'baik'))+' dari '+n+' RC memberi isi',verbatim(R,'baik')),
      card('TABEL 13','"Jika bisa mengubah SATU HAL dari proses pemberian GN, apa yang akan Anda ubah?"',
        'Jawaban terbuka · '+(n-noSugCount(R,'ubah'))+' dari '+n+' RC menyampaikan usulan',verbatim(R,'ubah'))
    ]);
}

function pg2(R){
  const {n,aps,cnt6,all6,order,fn}=calculate_pg2(R);

  const heat=tbl('<tr><th>Area Program</th><th class="ctr">n RC</th>'+
      SUBSHORT.map(s=>'<th class="ctr">'+s+'</th>').join('')+'<th class="ctr">Lengkap<br>6/6</th></tr>',
    aps.map(([a,rr])=>{
      const m=rr.length;
      return '<tr><td>'+esc(a)+'</td><td class="ctr">'+m+'</td>'+
        SUBLBL.map((_,ix)=>{const v=C(rr,r=>r.info6[ix]);
          return '<td class="h" style="'+heatBg(v,m)+'">'+v+'</td>';}).join('')+
        (function(){const v=C(rr,r=>r.info6.every(Boolean));
          return '<td class="h" style="'+heatBg(v,m)+'">'+v+'</td>';})()+'</tr>';
    }).join('')
    + '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td>'+
      cnt6.map(v=>'<td class="h"><b>'+v+'</b></td>').join('')+
      '<td class="h"><b>'+all6+'</b></td></tr>');

  const srcStaf=C(R,r=>r.srcStaf), srcKader=C(R,r=>r.srcKader);
  const pStaf=C(R,r=>r.prefStaf), pKader=C(R,r=>r.prefKader),
        pTelp=C(R,r=>r.prefTelp), pSos=C(R,r=>r.prefSos), pCetak=C(R,r=>r.prefCetak);

  const cross=kv([
    ['Menyebut staf WVI sebagai sumber <b>dan</b> preferensi', C(R,r=>r.srcStaf&&r.prefStaf)],
    ['Menyebut staf WVI hanya sebagai preferensi', C(R,r=>!r.srcStaf&&r.prefStaf)],
    ['Menyebut staf WVI hanya sebagai sumber aktual', C(R,r=>r.srcStaf&&!r.prefStaf)],
    ['Tidak menyebut staf WVI di kedua pertanyaan', C(R,r=>!r.srcStaf&&!r.prefStaf)]
  ]);

  const chTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th><th class="ctr">Staf WVI<br>aktual</th>'+
    '<th class="ctr">Staf<br>preferensi</th><th class="ctr">Kader/PJI<br>aktual</th>'+
    '<th class="ctr">Kader/PJI<br>preferensi</th><th class="ctr">Telp/SMS/WA<br>preferensi</th></tr>',
    aps.map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td><td class="ctr">'+
      C(rr,r=>r.srcStaf)+'</td><td class="ctr">'+C(rr,r=>r.prefStaf)+'</td><td class="ctr">'+
      C(rr,r=>r.srcKader)+'</td><td class="ctr">'+C(rr,r=>r.prefKader)+'</td><td class="ctr">'+
      C(rr,r=>r.prefTelp)+'</td></tr>').join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td><td class="ctr"><b>'+srcStaf+
    '</b></td><td class="ctr"><b>'+pStaf+'</b></td><td class="ctr"><b>'+srcKader+
    '</b></td><td class="ctr"><b>'+pKader+'</b></td><td class="ctr"><b>'+pTelp+'</b></td></tr>');

  return kpi([
    {t:'Informasi lengkap 6/6 sub-item',v:all6,b:'dari '+n+' RC · '+pctS(all6,n)},
    {t:'Menjawab "informasi cukup: semua"',v:C(R,r=>r.infoCukup==='Ya, semua'),b:'dari '+n+' RC'},
    {t:'Menjawab "informasi cukup: terbatas"',v:C(R,r=>r.infoCukup==='Ya, terbatas'),
      b:'dari '+n+' RC · "tidak sama sekali": '+C(R,r=>r.infoCukup==='Tidak sama sekali')},
    {t:'Sumber informasi kader / PJI',v:srcKader,b:'dari '+n+' RC · multi-respons'}
  ],'p4')
  + row('r-21',[
      card('TABEL 1','Information Completeness Funnel — 6 sub-item informasi GN',
        'Jumlah RC menjawab Ya per sub-item · basis '+n+' responden',funnel(fn)),
      card('TABEL 1','Kelengkapan informasi per AP','Jumlah RC menerima 6/6 sub-item terhadap n tiap AP',
        hb(aps.map(([a,rr])=>({k:esc(a),v:C(rr,r=>r.info6.every(Boolean)),
          lbl:C(rr,r=>r.info6.every(Boolean))+' / '+rr.length})),
          {tight:true,max:Math.max(1,...aps.map(x=>x[1].length))}))
    ])
  + row('r-1',[card('TABEL 1','Matriks sub-item informasi × Area Program',
      'Jumlah RC menjawab Ya · sel oranye menandai jumlah di bawah n AP tersebut',heat)])
  + '<div class="note"><b>Catatan pembacaan dua pertanyaan channel.</b> "Sumber aktual" berasal dari pertanyaan <i>Darimana Anda mendapat informasi?</i> (menanyakan <b>siapa</b>), sedangkan "preferensi" berasal dari <i>Bagaimana sebaiknya Anda menerima informasi?</i> (menanyakan <b>lewat cara apa</b>). Opsi Kader/PJI pada preferensi berasal dari isian bebas yang telah direkode.</div>'
  + row('r-2',[
      card('TABEL 2','Sumber informasi yang diterima RC',
        'Multi-respons · basis '+n+' RC',
        hb([{k:'Kader perlindungan anak / PJI',v:srcKader,cls:'dk',lbl:of_(srcKader,n)},
            {k:'Staf WVI',v:srcStaf,cls:'dk',lbl:of_(srcStaf,n)},
            {k:'Pemerintah setempat',v:0,lbl:'0'}],{max:n})),
      card('TABEL 2','Channel informasi yang disukai RC',
        'Multi-respons · basis '+n+' RC',
        hb([{k:'Langsung dari staf',v:pStaf,lbl:of_(pStaf,n)},
            {k:'Kader / PJI / pendamping',v:pKader,lbl:of_(pKader,n)},
            {k:'Telepon / SMS / WhatsApp',v:pTelp,lbl:of_(pTelp,n)},
            {k:'Media sosial',v:pSos,lbl:of_(pSos,n)},
            {k:'Media cetak',v:pCetak,lbl:of_(pCetak,n)}],{max:n}))
    ])
  + row('r-12',[
      card('TABEL 2','Staf WVI: sumber aktual dibanding preferensi',
        'Satu-satunya kategori yang tersedia di kedua pertanyaan · basis '+n+' RC',cross),
      card('TABEL 2','Sumber dan preferensi channel per AP','Jumlah RC · multi-respons',chTbl)
    ]);
}

function pg3(R){
  const {n,aps,fspD,serah,mudah,sulit,sulitRows,KESULIT,ks,jarak,kunj,jam,potYa,potNo,potTt,potVals,kepD,kepMean,tdkPuasRows,tp}=calculate_pg3(R);

  const potTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th><th class="ctr">Ada</th>'+
    '<th class="ctr">Tidak</th><th class="ctr">Tidak<br>tahu</th><th class="n">Median<br>nominal</th>'+
    '<th class="n">Rentang<br>nominal</th></tr>',
    aps.slice().sort((a,b)=>C(b[1],r=>r.potongan==='Ya')-C(a[1],r=>r.potongan==='Ya'))
    .map(([a,rr])=>{
      const v=rr.filter(r=>r.potJml!=null).map(r=>r.potJml);
      return '<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td><td class="ctr">'+
        C(rr,r=>r.potongan==='Ya')+'</td><td class="ctr">'+C(rr,r=>r.potongan==='Tidak')+
        '</td><td class="ctr">'+C(rr,r=>r.potongan==='Tidak tahu')+'</td><td class="n">'+
        (v.length?rp(med(v)):'—')+'</td><td class="n">'+
        (v.length?(Math.min(...v)===Math.max(...v)?nf(Math.min(...v)):nf(Math.min(...v))+'–'+nf(Math.max(...v))):'—')+
        '</td></tr>';
    }).join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td><td class="ctr"><b>'+potYa+
    '</b></td><td class="ctr"><b>'+potNo+'</b></td><td class="ctr"><b>'+potTt+'</b></td><td class="n"><b>'+
    (potVals.length?rp(med(potVals)):'—')+'</b></td><td class="n"><b>'+
    (potVals.length?nf(Math.min(...potVals))+'–'+nf(Math.max(...potVals)):'—')+'</b></td></tr>');

  return kpi([
    {t:'Jenis FSP terpakai',v:fspD.filter(f=>f.v>0).length,b:'termasuk nama yang diisi di "Lainnya"'},
    {t:'Harus datang ke kantor FSP',v:C(R,r=>r.harusDatang==='Ya'),b:'dari '+n+' RC'},
    {t:'Jarak median ke FSP',v:jarak.length?med(jarak)+' km':'—',sm:true,
      b:jarak.length?'rentang '+Math.min(...jarak)+'–'+Math.max(...jarak)+' km · n='+jarak.length:'—'},
    {t:'Melaporkan ada potongan',v:potYa,b:'dari '+n+' RC · '+potTt+' menjawab tidak tahu'},
    {t:'Puas/sangat puas pelayanan FSP',v:C(R,r=>r.kepFsp==='Puas'||r.kepFsp==='Sangat Puas'),b:'dari '+n+' RC'}
  ])
  + row('r-2',[
      card('TABEL 3','FSP yang digunakan untuk mencairkan GN','Jumlah RC · basis '+n+' responden',
        hb(fspD.filter(f=>f.v>0).map(f=>({k:esc(f.k),v:f.v,
          cls:(f.k==='Bank lain'||f.k==='Tidak tahu/lupa')?'l':''})),{tight:true})),
      card('TABEL 3','Siapa yang menyerahkan GN kepada RC','Jumlah RC · basis '+n+' responden',
        hb(['Petugas FSP','Petugas WVI','Petugas Kantor Desa','Petugas Kantor Kecamatan','Lainnya']
          .map(k=>({k:k,v:C(R,r=>r.serah===k),cls:k==='Lainnya'?'l':'',
            lbl:of_(C(R,r=>r.serah===k),n)})),{max:n}))
    ])
  + row('r-3',[
      card('TABEL 4','Persepsi proses pemberian GN melalui FSP','Basis '+n+' responden',
        donut(mudah,sulit,'Mudah','Sulit','menjawab Mudah')),
      card('TABEL 4','Hal yang menyulitkan proses',
        'Multi-respons · basis '+sulit+' RC yang menjawab "Sulit"',
        sulit? kv(ks.filter(x=>x.v>0).map(x=>[x.k,x.v]))
          : '<div class="empty" style="padding:20px">Tidak ada RC yang menjawab "Sulit" pada seleksi ini.</div>'),
      card('TABEL 3','Aksesibilitas FSP','Median per indikator · basis '+n+' RC',
        kv([
          ['Jarak ke kantor FSP', jarak.length? med(jarak)+' km <em>('+Math.min(...jarak)+'–'+Math.max(...jarak)+')</em>':'—'],
          ['Jumlah kunjungan sampai selesai', kunj.length? med(kunj)+' × <em>('+Math.min(...kunj)+'–'+Math.max(...kunj)+')</em>':'—'],
          ['Waktu total pergi–pulang', jam.length? dec(med(jam),1).replace(',0','')+' jam <em>('+Math.min(...jam)+'–'+Math.max(...jam)+')</em>':'—'],
          ['Pernah pakai FSP ini sebelumnya', C(R,r=>r.pernahFsp==='Ya')+' / '+n],
          ['Dapat info tata cara pengambilan', C(R,r=>r.tatacara==='Ya')+' / '+n],
          ['Difasilitasi transport/pendamping', C(R,r=>r.difasilitasi==='Ya')+' / '+C(R,r=>r.harusDatang==='Ya')]
        ]))
    ])
  + row('r-12',[
      card('TABEL 4','Transparansi potongan biaya',
        'Basis '+n+' responden · nominal dilaporkan '+potVals.length+' RC',
        hb([{k:'Tidak ada potongan',v:potNo,cls:'g',lbl:of_(potNo,n)},
            {k:'Ada potongan',v:potYa,lbl:of_(potYa,n)},
            {k:'Tidak tahu',v:potTt,cls:'l',lbl:of_(potTt,n)}],{max:n})),
      card('TABEL 4','Potongan biaya per Area Program',
        'Jumlah RC per jawaban dan median nominal yang dilaporkan',potTbl)
    ])
  + row('r-1',[card('TABEL 4','Kepuasan terhadap pelayanan FSP',
      'Basis '+n+' responden · skala 1–5',
      hb(kepD.map(d=>({k:d.k,v:d.v,cls:d.k==='Biasa'?'l':(d.k.indexOf('Tidak')>=0?'dk':''),
        lbl:of_(d.v,n)})),{max:n}))]);
}

function pg4(R){
  const {n,aps,WB,WBL,trAll,trZero,trSus,trOk,tca,hilangRp,CARA,caraD,lokD}=calculate_pg4(R);

  const dsTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th><th class="ctr">Sesuai</th><th class="ctr">Tidak sesuai</th></tr>',
    aps.slice().sort((a,b)=>C(b[1],r=>r.danaSesuai==='Tidak')-C(a[1],r=>r.danaSesuai==='Tidak'))
    .map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td><td class="ctr">'+
      C(rr,r=>r.danaSesuai==='Ya')+'</td><td class="ctr">'+C(rr,r=>r.danaSesuai==='Tidak')+'</td></tr>').join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td><td class="ctr"><b>'+
    C(R,r=>r.danaSesuai==='Ya')+'</b></td><td class="ctr"><b>'+C(R,r=>r.danaSesuai==='Tidak')+'</b></td></tr>');

  const caraTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th>'+
    CARA.filter(k=>C(R,r=>r.caraPref===k)>0).map(k=>'<th class="ctr">'+esc(tr(k)).replace(/ /g,'<br>')+'</th>').join('')+'</tr>',
    aps.map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td>'+
      CARA.filter(k=>C(R,r=>r.caraPref===k)>0).map(k=>'<td class="ctr">'+C(rr,r=>r.caraPref===k)+'</td>').join('')+'</tr>').join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td>'+
      CARA.filter(k=>C(R,r=>r.caraPref===k)>0).map(k=>'<td class="ctr"><b>'+C(R,r=>r.caraPref===k)+'</b></td>').join('')+'</tr>');

  return kpi([
    {t:'Dana sesuai informasi awal',v:C(R,r=>r.danaSesuai==='Ya'),b:'dari '+n+' RC'},
    {t:'Lokasi sesuai informasi awal',v:C(R,r=>r.lokasiSesuai==='Ya'),b:'dari '+n+' RC'},
    {t:'Merasa aman saat distribusi',v:C(R,r=>r.aman==='Ya'),b:'dari '+n+' RC'},
    {t:'Diperlakukan dengan hormat',v:C(R,r=>r.hormat==='Ya'),b:'dari '+n+' RC'},
    {t:'Biaya transport median',v:trOk.length?rp(med(trOk)):'—',sm:true,
      b:'basis '+trOk.length+' RC dengan nilai valid'}
  ])
  + row('r-2',[
      card('TABEL 5','Jarak waktu informasi sampai dana bisa diambil',
        'Persepsi RC · basis '+n+' responden',
        hb(WB.map((k,ix)=>({k:WBL[ix],v:C(R,r=>r.waktuInfo===k),
          cls:ix===3?'l':(ix===4?'ll':''),lbl:of_(C(R,r=>r.waktuInfo===k),n)})),{max:n})),
      card('TABEL 5','Kesesuaian dana yang diterima','Jumlah RC per AP · basis '+n+' responden',dsTbl)
    ])
  + row('r-3',[
      card('TABEL 6','Total Cost of Access — biaya transport',
        'Basis '+n+' RC · '+trOk.length+' nilai dipakai dalam perhitungan',
        kv([
          ['Melaporkan biaya Rp 0', trZero+' / '+n],
          ['Nilai di bawah Rp 1.000', trSus.length+' / '+n],
          ['Nilai valid dipakai', trOk.length+' / '+n],
          ['Median biaya transport', trOk.length?rp(med(trOk)):'—'],
          ['Rentang biaya transport', trOk.length?rp(Math.min(...trOk))+' – '+rp(Math.max(...trOk)):'—'],
          ['Biaya transport terhadap nilai GN', tca.length?'median '+dec(med(tca),1)+'%':'—']
        ])),
      card('TABEL 6','Kehilangan kesempatan kerja','Basis '+n+' responden',
        hb([{k:'Tidak kehilangan',v:C(R,r=>r.hilang==='Tidak'),cls:'g',lbl:of_(C(R,r=>r.hilang==='Tidak'),n)},
            {k:'Tidak relevan (tidak bekerja)',v:C(R,r=>r.hilang.indexOf('Tidak relevan')===0),cls:'l',
             lbl:of_(C(R,r=>r.hilang.indexOf('Tidak relevan')===0),n)},
            {k:'Ya, kehilangan',v:C(R,r=>r.hilang==='Ya'),lbl:of_(C(R,r=>r.hilang==='Ya'),n)}],{max:n})),
      card('TABEL 7','Lokasi penerimaan, keamanan, dan perlakuan','Basis '+n+' responden',
        kv(lokD.filter(d=>d.v>0).map(d=>[esc(d.k),d.v+' / '+n]).concat([
          ['Lokasi sesuai informasi awal', C(R,r=>r.lokasiSesuai==='Ya')+' / '+n],
          ['Merasa aman selama proses', C(R,r=>r.aman==='Ya')+' / '+n],
          ['Diperlakukan dengan hormat', C(R,r=>r.hormat==='Ya')+' / '+n]
        ])))
    ])
  + row('r-12',[
      card('TABEL 6','Cara penyaluran GN yang dinilai lebih tepat oleh RC',
        'Pilihan tunggal · basis '+n+' responden',
        hb(caraD.map(d=>({k:esc(d.k),v:d.v,cls:(d.k==='Lainnya'||d.k==='Tidak menjawab')?'l':'',
          lbl:of_(d.v,n)})),{max:n})),
      card('TABEL 6','Cara penyaluran yang dinilai lebih tepat, per AP',
        'Jumlah RC · basis '+n+' responden',caraTbl)
    ]);
}
/* ================= PAGES 5 - 7 ================= */
function pg5(R){
  const {n,PAKAI,UNMET,BELANJA,KEM,pk,unmetRows,um,bl,kem,terlarangYa,terlarangNo,domD,batasanRows}=calculate_pg5(R);

  return kpi([
    {t:'Dipakai untuk pendidikan anak',v:C(R,r=>r.pakai.indexOf('Pendidikan anak')>=0),
      b:'dari '+n+' RC · multi-respons'},
    {t:'Kebutuhan dasar terpenuhi semua / sebagian besar',
      v:C(R,r=>r.kemampuan==='Semua'||r.kemampuan==='Sebagian besar'),b:'dari '+n+' RC'},
    {t:'Anak penerima paling dominan memutuskan',v:C(R,r=>r.dominan==='Anak penerima'),b:'dari '+n+' RC'},
    {t:'Menjawab mudah membelanjakan dana',v:C(R,r=>r.sulitBelanja==='Mudah'),b:'dari '+n+' RC'},
    {t:'Melaporkan pembelian rokok / kosmetik / alkohol',v:terlarangYa,b:'dari '+n+' RC'}
  ])
  + row('r-21',[
      card('TABEL 8','Kategori penggunaan dana GN',
        'Multi-respons · jumlah RC · basis '+n+' responden',
        hb(pk.filter(x=>x.v>0).map(x=>({k:esc(x.k),v:x.v,cls:x.k==='Lainnya'?'l':''})),{tight:true})),
      card('TABEL 8','Sejauh mana dana GN memenuhi kebutuhan dasar RT',
        'Pilihan tunggal · basis '+n+' responden',
        hb(kem.map((d,ix)=>({k:d.k,v:d.v,cls:ix===2?'l':(ix===3?'ll':(ix===4?'dk':'')),
          lbl:of_(d.v,n)})),{max:n}))
    ])
  + row('r-3',[
      card('TABEL 8','Kebutuhan dasar yang tidak dapat dipenuhi',
        'Multi-respons · basis '+unmetRows.length+' RC yang menjawab bagian ini',
        unmetRows.length? hb(um.filter(x=>x.v>0).map(x=>({k:esc(x.k),v:x.v,cls:x.k==='Lainnya'?'l':''})),{tight:true})
          : '<div class="empty" style="padding:20px">Tidak ada RC yang mengisi bagian ini.</div>'),
      card('TABEL 8','Pembelian rokok, kosmetik, atau minuman beralkohol',
        'Pertanyaan sensitif · basis '+n+' responden',
        donut(terlarangYa,terlarangNo,'Ya','Tidak','melaporkan Ya')),
      card('TABEL 8','Keputusan penggunaan dan tempat belanja',
        'Basis '+n+' responden · tempat belanja multi-respons',
        kv(domD.filter(d=>d.v>0).slice(0,4).map(d=>[esc(d.k)+' memutuskan',d.v+' / '+n]).concat([
          ['Prioritas penggunaan: anak di bawah 18 tahun', C(R,r=>r.prioritas==='Anak <18 tahun')+' / '+n]
        ]).concat(bl.filter(x=>x.v>0).slice(0,4).map(x=>['Belanja di '+x.k.toLowerCase(),x.v+' / '+n])).concat([
          ['Menyatakan harga barang naik', C(R,r=>r.harga==='Naik')+' / '+n],
          ['Menyatakan barang langka', C(R,r=>r.sedia==='Langka')+' / '+n]
        ])))
    ])
  + row('r-1',[card('TABEL 8','Kebutuhan yang ingin dibeli tetapi tidak diperbolehkan aturan',
      C(R,r=>r.batasan==='Ya')+' dari '+n+' RC menjawab Ya · daftar kebutuhan yang disebut',
      batasanRows.length? '<ul class="vb" style="max-height:150px">'+
        batasanRows.map(r=>'<li>'+esc(r.batasanItem)+'</li>').join('')+'</ul>'
        : '<div class="empty" style="padding:20px">Tidak ada isian pada seleksi ini.</div>')]);
}

function pg6(R){
  const {n,aps,kepD,kv5,mean,kepPos,PUASAL,TDKPUAS,posRows,negRows,pa,na,bantuanYa,L,m}=calculate_pg6(R);

  const kepTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th>'+
    KEP5.filter(k=>C(R,r=>r.kepuasan===k)>0).map(k=>'<th class="ctr">'+tr(k).replace(/ /g,'<br>')+'</th>').join('')+'</tr>',
    aps.map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td>'+
      KEP5.filter(k=>C(R,r=>r.kepuasan===k)>0).map(k=>'<td class="ctr">'+C(rr,r=>r.kepuasan===k)+'</td>').join('')+'</tr>').join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td>'+
      KEP5.filter(k=>C(R,r=>r.kepuasan===k)>0).map(k=>'<td class="ctr"><b>'+C(R,r=>r.kepuasan===k)+'</b></td>').join('')+'</tr>');

  const bantuanTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th><th class="ctr">Ya</th></tr>',
    aps.slice().sort((a,b)=>C(b[1],r=>r.bantuanLain==='Ya')-C(a[1],r=>r.bantuanLain==='Ya'))
    .map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td><td class="ctr">'+
      C(rr,r=>r.bantuanLain==='Ya')+'</td></tr>').join(''));

  const BD=[['Kecepatan proses','bKecepatan','Lebih cepat'],['Pilihan / fleksibilitas','bPilihan','Lebih baik'],
    ['Privasi / martabat','bDignity','Lebih baik'],['Kemudahan proses','bKemudahan','Lebih mudah']];
  const bdBars=hb(BD.map(([lbl,key,pos])=>({k:lbl,v:C(L,r=>r[key]===pos),
    lbl:of_(C(L,r=>r[key]===pos),m)})),{max:Math.max(1,m)});
  const BO=['Modalitas CVP (sekarang)','Sama saja','Modalitas lama (barang dari staff)','Tidak yakin'];
  const boTbl=tbl('<tr><th>Area Program</th><th class="ctr">n subset</th>'+
    BO.filter(k=>C(L,r=>r.bOverall===k)>0).map(k=>'<th class="ctr">'+tr(k).replace(/ /g,'<br>')+'</th>').join('')+'</tr>',
    aps.map(([a,rr])=>{
      const ll=rr.filter(r=>r.lama==='Ya');
      return '<tr><td>'+esc(a)+'</td><td class="ctr">'+ll.length+'</td>'+
        BO.filter(k=>C(L,r=>r.bOverall===k)>0).map(k=>'<td class="ctr">'+
          (ll.length?C(ll,r=>r.bOverall===k):'—')+'</td>').join('')+'</tr>';
    }).join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+m+'</b></td>'+
      BO.filter(k=>C(L,r=>r.bOverall===k)>0).map(k=>'<td class="ctr"><b>'+C(L,r=>r.bOverall===k)+'</b></td>').join('')+'</tr>');

  return kpi([
    {t:'Kepuasan program',v:mean+'<span class="u"> / 5</span>',b:'rata-rata skala 1–5 · n='+kv5.length},
    {t:'Puas / sangat puas',v:kepPos,b:'dari '+n+' RC'},
    {t:'Bantuan sesuai kebutuhan anak',v:C(R,r=>r.sesuaiKebutuhan==='Ya'),b:'dari '+n+' RC'},
    {t:'Subset pernah terima modalitas lama',v:m,b:'dari '+n+' RC'},
    {t:'Dibantu organisasi / pihak lain',v:bantuanYa,b:'dari '+n+' RC'}
  ])
  + row('r-3',[
      card('TABEL 9','Sebaran kepuasan keseluruhan','Skala 1–5 · basis '+n+' responden',
        hb(KEP5.map(k=>({k:k+' ('+KEPVAL[k]+')',v:C(R,r=>r.kepuasan===k),
          cls:k==='Biasa'?'l':(k.indexOf('Tidak')>=0?'dk':''),lbl:of_(C(R,r=>r.kepuasan===k),n)})),{max:n})),
      card('TABEL 9','Kepuasan per Area Program','Jumlah RC · basis '+n+' responden',kepTbl),
      card('TABEL 9','Bantuan dari organisasi atau pihak lain','Basis '+n+' responden',
        hb([{k:'Tidak ada',v:n-bantuanYa,cls:'g',lbl:of_(n-bantuanYa,n)},
            {k:'Ya, ada',v:bantuanYa,lbl:of_(bantuanYa,n)}],{max:n})+
        '<div style="margin-top:12px">'+bantuanTbl+'</div>')
    ])
  + '<div class="note"><b>Basis bagian perbandingan modalitas adalah '+m+' RC</b>, yaitu responden yang pernah menerima GN dengan metode lama sebelum 2025.</div>'
  + (m? row('r-12',[
      card('TABEL 9','Perbandingan CVP dengan modalitas lama, per dimensi',
        'Basis '+m+' RC yang pernah menerima modalitas lama',
        '<div class="sw"><span><i style="background:var(--o)"></i>lebih baik / lebih cepat / lebih mudah</span><span><i style="background:var(--d-4)"></i>sama</span></div>'+bdBars),
      card('TABEL 9','Preferensi modalitas keseluruhan, per AP',
        'Jumlah RC · basis '+m+' RC subset modalitas lama',boTbl)
    ]) : row('r-1',[card('TABEL 9','Perbandingan modalitas','',
        '<div class="empty">Tidak ada RC pada seleksi ini yang pernah menerima GN modalitas lama, sehingga bagian ini kosong.</div>')]));
}

function pg7(R){
  const {n,aps,infoP,mekAda,mekPakai,kepOk,KOMPL,kp,timbalYa}=calculate_pg7(R);

  const apTbl=tbl('<tr><th>Area Program</th><th class="ctr">n</th><th class="ctr">Terima info<br>umum WVI</th>'+
    '<th class="ctr">Tahu<br>mekanisme</th><th class="ctr">Pernah<br>memakai</th></tr>',
    aps.slice().sort((a,b)=>C(b[1],r=>r.mekAda==='Ya')-C(a[1],r=>r.mekAda==='Ya'))
    .map(([a,rr])=>'<tr><td>'+esc(a)+'</td><td class="ctr">'+rr.length+'</td><td class="ctr">'+
      C(rr,r=>r.infoProgram==='Ya')+'</td><td class="ctr">'+C(rr,r=>r.mekAda==='Ya')+
      '</td><td class="ctr">'+C(rr,r=>r.mekPakai==='Ya')+'</td></tr>').join('')+
    '<tr><td><b>Total seleksi</b></td><td class="ctr"><b>'+n+'</b></td><td class="ctr"><b>'+infoP+
    '</b></td><td class="ctr"><b>'+mekAda+'</b></td><td class="ctr"><b>'+mekPakai+'</b></td></tr>');

  return kpi([
    {t:'Menerima informasi umum program WVI',v:infoP,b:'dari '+n+' RC'},
    {t:'Tahu mekanisme feedback/komplain',v:mekAda,b:'dari '+n+' RC'},
    {t:'Pernah memakai mekanisme',v:mekPakai,b:'dari '+mekAda+' RC yang tahu'},
    {t:'Puas penyelesaian komplain',v:kepOk,b:'dari '+mekPakai+' RC yang memakai'}
  ],'p4')
  + row('r-2',[
      card('TABEL 11','Accountability Funnel — mekanisme komplain',
        'Denominator berbeda di tiap tahap dan ditulis eksplisit',
        funnel([
          {k:'Seluruh responden',v:n,n:'basis '+n,w:100},
          {k:'Menerima informasi umum program WVI',v:infoP,n:infoP+'/'+n,w:n?infoP/n*100:0},
          {k:'Tahu mekanisme feedback/komplain',v:mekAda,n:mekAda+'/'+n,w:n?mekAda/n*100:0},
          {k:'Pernah memakai mekanisme',v:mekPakai,n:mekPakai+'/'+mekAda,pct:mekAda?mekPakai/mekAda*100:null,w:n?mekPakai/n*100:0},
          {k:'Puas / sangat puas penyelesaian',v:kepOk,n:kepOk+'/'+mekPakai,pct:mekPakai?kepOk/mekPakai*100:null,w:n?kepOk/n*100:0}
        ])),
      card('TABEL 11','Channel yang disukai untuk mengajukan keluhan',
        'Multi-respons · basis '+n+' responden',
        hb(kp.map(x=>({k:esc(x.k),v:x.v,lbl:of_(x.v,n)})),{max:n}))
    ])
  + row('r-2',[
      card('TABEL 11','Pengetahuan mekanisme komplain per AP','Jumlah RC · basis '+n+' responden',apTbl),
      card('TABEL 11','Permintaan jasa timbal balik',
        'Pertanyaan sensitif · basis '+n+' responden · agregat tanpa identitas',
        donut(timbalYa,n-timbalYa,'Ada permintaan','Tidak ada permintaan','laporan'))
    ]);
}
/* ======================= [C] REGISTRASI HALAMAN & IKON ================== */
const ICO={
  cover:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
  grid :'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  users:'<svg viewBox="0 0 24 24"><path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/><circle cx="9" cy="7" r="3.2"/><path d="M22 19v-1a4 4 0 0 0-3-3.87"/><path d="M16.5 4.2a3.2 3.2 0 0 1 0 5.6"/></svg>',
  info :'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  bank :'<svg viewBox="0 0 24 24"><path d="M3 10 12 4l9 6"/><path d="M5 10v9"/><path d="M19 10v9"/><path d="M3 20h18"/><path d="M10 20v-6h4v6"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  wallet:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18"/><path d="M16.5 14.8h.01"/></svg>',
  smile:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.2a4.4 4.4 0 0 0 7 0"/><path d="M9 9.5h.01"/><path d="M15 9.5h.01"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z"/><path d="M8.8 12.2l2.3 2.3 4.1-4.6"/></svg>',
  team:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><path d="M15 14h1a4 4 0 0 1 4 4v2"/></svg>'
};

export const PAGES=[
 ['p0','Cover',null,null,cover,ICO.cover],
 ['p1','Overview','Overview','Ringkasan 6 area asesmen',pg1,ICO.grid],
 ['pd','Demografi','Demografi Responden &amp; Rumah Tangga','Profil anak penerima, responden, kepala keluarga, dan rumah tangga',page_demografi,ICO.users],
 ['p2','Informasi','Area 1 \u2014 Penyediaan Informasi','Tabel 1 &amp; 2',pg2,ICO.info],
 ['p3','Kinerja FSP','Area 2 \u2014 Kinerja Penyedia Jasa Keuangan (FSP)','Tabel 3 &amp; 4',pg3,ICO.bank],
 ['p4','Distribusi','Area 3 \u2014 Proses Distribusi','Tabel 5, 6 &amp; 7',pg4,ICO.truck],
 ['p5','Penggunaan','Area 4 \u2014 Penggunaan Dana','Tabel 8',pg5,ICO.wallet],
 ['p6','Kepuasan','Area 5 \u2014 Kepuasan &amp; Perbandingan Modalitas','Tabel 9',pg6,ICO.smile],
 ['p7','Akuntabilitas','Area 6 \u2014 Akuntabilitas','Tabel 11',pg7,ICO.shield],
 ['p8','Cover Belakang',null,null,credits,ICO.team]
];
