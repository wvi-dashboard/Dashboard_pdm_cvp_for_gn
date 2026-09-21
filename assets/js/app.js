import {currentLang,setLanguage,tr,translateUI} from './i18n.js';
import {esc,pctS} from './format.js';
import {PAGES} from './pages.js';
import {DATA,AP_ALL,FSP_ALL,FY_ALL,datasetMeta,installDataset,COVER_ID,current,setPage,SLICERS,state,openSlicer,setOpenSlicer,anyOn,pass,filtered,resetFilters,slicerLabel} from './state.js';
import {loadCatalog,loadDataset} from './data.js';
import {buildCSV,exportFilename} from './export.js';
const $=id=>document.getElementById(id);
function slicer(key,title,values){
  const sel=state[key], open=(openSlicer===key);
  const items=values.map(v=>({v:v,n:DATA.filter(r=>r[key]===v && pass(r,key)).length}));
  const allOn=(sel.size===0);
  const dispTitle = tr(title);

  let topControls='';
  if(items.length>5){
    const placeholder = (currentLang==='en' ? 'Search '+dispTitle+'...' : 'Cari '+dispTitle+'...');
    const txtAll = (currentLang==='en' ? 'Select All' : 'Pilih Semua');
    const txtClear = (currentLang==='en' ? 'Clear' : 'Kosongkan');
    topControls='<div class="sl-search-wrap">'+
      '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'+
      '<input type="text" class="sl-search-inp" placeholder="'+esc(placeholder)+'" data-sl-search="'+key+'">'+
    '</div>'+
    '<div class="sl-quick-actions">'+
      '<button type="button" class="sl-act-link" data-quick="all" data-f="'+key+'">'+txtAll+'</button>'+
      '<span>·</span>'+
      '<button type="button" class="sl-act-link" data-quick="clear" data-f="'+key+'">'+txtClear+'</button>'+
    '</div>';
  }

  const selectAllTxt = (currentLang==='en' ? '(Select all)' : '(Pilih semua)');
  let list='<div class="sl-list" data-f="'+key+'">';
  list+='<label class="sl-i sl-all'+(allOn?' sel':'')+'">'+
        '<input type="checkbox" data-all="1"'+(allOn?' checked':'')+'>'+
        '<span>'+selectAllTxt+'</span><b>'+items.reduce((a,b)=>a+b.n,0)+'</b></label>';
  list+=items.map(i=>{
    const on=sel.has(i.v), dis=(i.n===0 && !on && key!=='fy');
    const dispVal = tr(i.v);
    return '<label class="sl-i'+(on?' sel':'')+(dis?' dis':'')+'" data-label="'+esc(dispVal).toLowerCase()+'">'+
      '<input type="checkbox" data-v="'+esc(i.v)+'"'+(on?' checked':'')+(dis?' disabled':'')+'>'+
      '<span title="'+esc(dispVal)+'">'+esc(dispVal)+'</span><b>'+i.n+'</b></label>';
  }).join('');
  list+='</div>';

  return '<div class="sl'+(open?' open':'')+'" data-sl="'+key+'">'+
    '<button type="button" class="sl-btn" data-toggle="'+key+'" aria-expanded="'+(open?'true':'false')+'">'+
      '<span class="txt"><span class="lbl">'+dispTitle+'</span>'+
      '<span class="val'+(sel.size?'':' off')+'">'+esc(slicerLabel(key))+'</span></span>'+
      '<span class="car"></span></button>'+
    '<div class="sl-pop">'+topControls+list+'</div></div>';
}

function buildFilters(){
  const R=filtered(), aps=new Set(R.map(r=>r.ap));
  $('slicers').innerHTML = SLICERS.map(([k,t,vals])=>slicer(k,t,vals())).join('');
  if(currentLang === 'en'){
    $('f-stat').innerHTML='<b>'+R.length+'</b> of '+DATA.length+' RCs \u00b7 '+aps.size+' PAs';
    $('f-reset-txt').textContent = 'Clear filters';
  } else {
    $('f-stat').innerHTML='<b>'+R.length+'</b> dari '+DATA.length+' RC \u00b7 '+aps.size+' AP';
    $('f-reset-txt').textContent = 'Bersihkan filter';
  }
  $('f-reset').hidden = !anyOn();
}

function setOpen(key){
  setOpenSlicer(key);
  document.querySelectorAll('#slicers .sl').forEach(sl=>{
    const on=(sl.dataset.sl===key);
    sl.classList.toggle('open',on);
    const b=sl.querySelector('.sl-btn');
    if(b) b.setAttribute('aria-expanded',String(on));
  });
}
const closeSlicers=()=>setOpen(null);

function onSlicerClick(e){
  const head=e.target.closest('.sl-btn');
  if(!head) return;
  e.stopPropagation();
  const key=head.dataset.toggle;
  setOpen(openSlicer===key ? null : key);
}
function onSlicerChange(e){
  const inp=e.target;
  if(!inp || inp.tagName!=='INPUT' || inp.disabled) return;
  const box=inp.closest('.sl-list'); if(!box) return;
  const key=box.dataset.f;
  if(inp.dataset.all){ state[key].clear(); }
  else {
    const v=inp.dataset.v;
    state[key].delete('__none__');
    state[key].has(v) ? state[key].delete(v) : state[key].add(v);
    if(!state[key].size) state[key].add('__none__');
  }
  render();
}

document.addEventListener('click',e=>{
  if(openSlicer && !e.target.closest('.sl')) closeSlicers();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape' && openSlicer){
    const trigger=document.querySelector('[data-toggle="'+openSlicer+'"]');
    closeSlicers(); trigger?.focus();
  }
});

function syncChrome(){
  const isCover=current===COVER_ID||current==='p8';
  $('fbar').hidden = isCover;
  if(isCover) setOpenSlicer(null);
  updatePrintLetterhead();
}

function render(){
  const active=document.activeElement;
  const focusKey=active?.closest('[data-f]')?.dataset.f;
  const focusValue=active?.dataset.v;
  const searches=[...document.querySelectorAll('[data-sl-search]')].map(el=>[el.dataset.slSearch,el.value]);
  // Preserve the print header before replacing the rendered page tree.
  const letterhead = $('print-letterhead');
  if(letterhead) $('pages').before(letterhead);
  buildFilters();
  for(const [key,value] of searches){
    const input=document.querySelector('[data-sl-search="'+key+'"]');
    if(input){ input.value=value; input.dispatchEvent(new Event('input',{bubbles:true})); }
  }
  if(focusKey && focusValue!==undefined){
    [...document.querySelectorAll('[data-f="'+focusKey+'"] input[data-v]')].find(el=>el.dataset.v===focusValue)?.focus();
  }
  const R=filtered();
  const isEn = (currentLang === 'en');
  const selTxt = (state.ap.size ? (state.ap.has('__none__')?(isEn?'None selected':'Tidak ada pilihan'):[...state.ap].join(', ')) : (isEn ? 'all PAs' : 'semua AP'))
    + (state.fy.size ? ' · FY '+[...state.fy].join('/') : '')
    + (state.fsp.size  ? ' \u00b7 FSP: '+[...state.fsp].join(', ') : '')
    + (state.lama.size ? ' \u00b7 '+(isEn?'old modality: ':'modalitas lama: ')+[...state.lama].map(v=>tr(v)).join('/') : '');

  const emptyMsg = isEn
    ? '<div class="empty"><b>No respondents match this filter combination.</b><br>Broaden your filters above or click "Reset filters".</div>'
    : '<div class="empty"><b>Tidak ada responden pada kombinasi filter ini.</b><br>Longgarkan salah satu filter di atas atau tekan "Bersihkan filter".</div>';

  $('pages').innerHTML = PAGES.map(([id,,h1,sub,fn])=>{
    const isCover = (id===COVER_ID||id==='p8');
    const head = isCover ? '' :
      '<div class="top"><div><h1>'+tr(h1)+'</h1><div class="sub">'+tr(sub)+' \u00b7 '+esc(selTxt)+
      ' \u00b7 '+R.length+(isEn?' RCs':' RC')+'</div></div></div>';
    const body = (isCover || R.length) ? fn(R) : emptyMsg;
    return '<section class="pg'+(isCover?' pg-cover':'')+(id===current?' on':'')+
      '" id="'+id+'">'+head+body+'</section>';
  }).join('');
  translateUI($('pages'));
  syncChrome();
}

function closeMobileDrawer(){
  const sb=$('sidebar');
  const bd=$('backdrop');
  if(sb) sb.classList.remove('drawer-open');
  if(bd) bd.classList.remove('active');
  syncDrawer();
}

function go(id){
  setPage(id);
  document.querySelectorAll('.pg').forEach(s=>s.classList.toggle('on',s.id===id));
  document.querySelectorAll('#nav button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.p===id)));
  syncChrome();
  closeMobileDrawer();
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const heading=$(id)?.querySelector('h1,h2');
  if(heading){ heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
}

/* ==================== [D] PEMBANGUN MENU (DYNAMIC I18N) ========================= */
function buildNav(){
  const nav = $('nav');
  nav.innerHTML = '';
  PAGES.forEach(([id,label,,,,icon])=>{
    const b=document.createElement('button');
    b.type='button';
    const dispLabel = tr(label);
    b.innerHTML=(icon||'')+'<span>'+dispLabel+'</span>';
    b.dataset.p=id;
    b.title=dispLabel;
    b.setAttribute('aria-label',dispLabel);
    b.setAttribute('aria-current',String(id===current));
    b.addEventListener('click',()=>go(id));
    nav.appendChild(b);
  });
}

/* ---------- Sidebar Toggle Handlers (Desktop & Mobile) ---------- */
const frame=$('app-frame');
const menuToggle=$('menu-toggle');
const mobMenuToggle=$('mob-menu-toggle');
const sidebar=$('sidebar');
const backdrop=$('backdrop');

if(menuToggle && frame){
  menuToggle.addEventListener('click',()=>{
    frame.classList.toggle('collapsed');
    menuToggle.setAttribute('aria-expanded',String(!frame.classList.contains('collapsed')));
  });
}

if(mobMenuToggle && sidebar && backdrop){
  mobMenuToggle.addEventListener('click',()=>{
    sidebar.classList.toggle('drawer-open');
    backdrop.classList.toggle('active');
    syncDrawer();
    if(sidebar.classList.contains('drawer-open')) sidebar.querySelector('nav button')?.focus();
  });
  backdrop.addEventListener('click',closeMobileDrawer);
}

/* ==================== FITUR TAMBAHAN & REKOMENDASI ==================== */
const STORAGE_KEY = 'pdm_cvp_state_v2';
const mobileQuery = window.matchMedia('(max-width:820px)');
function syncDrawer(){
  const open=sidebar.classList.contains('drawer-open');
  sidebar.inert=mobileQuery.matches && !open;
  mobMenuToggle.setAttribute('aria-expanded',String(open));
  mobMenuToggle.setAttribute('aria-controls','sidebar');
  document.body.classList.toggle('drawer-visible',mobileQuery.matches && open);
}
mobileQuery.addEventListener('change',()=>{ closeMobileDrawer(); syncDrawer(); });
document.addEventListener('keydown',e=>{
  if(!mobileQuery.matches || !sidebar.classList.contains('drawer-open')) return;
  if(e.key==='Escape'){ closeMobileDrawer(); mobMenuToggle.focus(); }
  if(e.key==='Tab'){
    const targets=[...sidebar.querySelectorAll('button')].filter(el=>el.getClientRects().length);
    const first=targets[0],last=targets.at(-1);
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  }
});
$('filter-toggle').addEventListener('click',()=>{
  const closed=$('fbar').classList.toggle('filters-collapsed');
  $('filter-toggle').setAttribute('aria-expanded',String(!closed));
  $('filter-toggle').textContent=currentLang==='en'?(closed?'Show filters':'Hide filters'):(closed?'Tampilkan filter':'Sembunyikan filter');
});

function updateLangUI(){
  document.documentElement.lang=currentLang;
  const isEn = (currentLang === 'en');
  const closed=$('fbar').classList.contains('filters-collapsed');
  $('filter-toggle').textContent = isEn ? (closed?'Show filters':'Hide filters') : (closed?'Tampilkan filter':'Sembunyikan filter');
  const resetTxt=$('f-reset-txt');
  if(resetTxt) resetTxt.textContent=isEn?'Clear filters':'Bersihkan filter';
  const langToggle = $('lang-toggle');
  const mobLangToggle = $('mob-lang-toggle');
  if(langToggle) langToggle.classList.toggle('active-en', isEn);
  if(mobLangToggle) mobLangToggle.classList.toggle('active-en', isEn);

  const expBtnTxt = $('btn-export-csv-txt');
  if(expBtnTxt) expBtnTxt.textContent = isEn ? 'Export CSV' : 'Ekspor CSV';

  const prtBtnTxt = $('btn-print-pdf-txt');
  if(prtBtnTxt) prtBtnTxt.textContent = isEn ? 'Print Page' : 'Cetak Halaman';

  const prtAllBtnTxt = $('btn-print-all-txt');
  if(prtAllBtnTxt) prtAllBtnTxt.textContent = isEn ? 'Print Full Dossier' : 'Cetak Semua (Dossier)';

  const prtBtn = $('btn-print-pdf');
  if(prtBtn) prtBtn.title = isEn ? 'Print or save current active page as PDF' : 'Cetak atau simpan halaman aktif sebagai PDF';

  const prtAllBtn = $('btn-print-all');
  if(prtAllBtn) prtAllBtn.title = isEn ? 'Print all assessment areas (Tables 1–11) as a comprehensive donor dossier' : 'Cetak seluruh area asesmen (Tabel 1–11) sebagai satu berkas PDF utuh untuk donor';
}

function toggleLang(){
  setLanguage(currentLang === 'en' ? 'id' : 'en');
  updateLangUI();
  updateDatasetUI();
  buildNav();
  render();
  saveState();
}

function saveState(){
  try{
    const payload = {
      datasetId: datasetMeta.id,
      theme: document.body.classList.contains('dark') ? 'dark' : 'light',
      lang: currentLang,
      page: current,
      ap: [...state.ap],
      fy: [...state.fy],
      fsp: [...state.fsp],
      lama: [...state.lama]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }catch(e){}
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const s = JSON.parse(raw);
    if(!s || typeof s!=='object') return;
    if(s.theme === 'dark'){
      document.body.classList.add('dark');
    }
    if(s.lang === 'en' || s.lang === 'id'){
      setLanguage(s.lang);
    }
    if((!s.datasetId || s.datasetId===datasetMeta.id) && Array.isArray(s.ap)) s.ap.filter(v=>v==='__none__'||AP_ALL.includes(v)).forEach(v=>state.ap.add(v));
    if((!s.datasetId || s.datasetId===datasetMeta.id) && Array.isArray(s.fy)) s.fy.filter(v=>v==='__none__'||FY_ALL.includes(v)).forEach(v=>state.fy.add(v));
    if((!s.datasetId || s.datasetId===datasetMeta.id) && Array.isArray(s.fsp)) s.fsp.filter(v=>v==='__none__'||FSP_ALL.includes(v)).forEach(v=>state.fsp.add(v));
    if((!s.datasetId || s.datasetId===datasetMeta.id) && Array.isArray(s.lama)) s.lama.filter(v=>['Ya','Tidak','__none__'].includes(v)).forEach(v=>state.lama.add(v));
    if(s.page && PAGES.some(p=>p[0]===s.page)){
      setPage(s.page);
    }
  }catch(e){}
  updateLangUI();
}

function toggleTheme(){
  document.body.classList.toggle('dark');
  saveState();
}

const themeToggle = $('theme-toggle');
const mobThemeToggle = $('mob-theme-toggle');
if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
if(mobThemeToggle) mobThemeToggle.addEventListener('click', toggleTheme);

const langToggle = $('lang-toggle');
const mobLangToggle = $('mob-lang-toggle');
if(langToggle) langToggle.addEventListener('click', toggleLang);
if(mobLangToggle) mobLangToggle.addEventListener('click', toggleLang);

function exportCSV(){
  const R = filtered();
  if(!R.length){
    alert('Tidak ada responden pada kombinasi filter ini untuk diekspor.');
    return;
  }
  const blob = new Blob([buildCSV(R,currentLang)], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const apTxt = state.ap.size===1 ? [...state.ap][0] : 'Semua_AP';
  a.download = exportFilename(datasetMeta.id,apTxt);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const btnExport = $('btn-export-csv');
if(btnExport) btnExport.addEventListener('click', exportCSV);


function updatePrintLetterhead(isAllPages = false){
  const pl = $('print-letterhead');
  if(!pl) return;
  if(!isAllPages && (current === COVER_ID||current==='p8')){
    pl.innerHTML = '';
    pl.style.display = 'none';
    return;
  }
  pl.style.display = '';

  // Position the letterhead dynamically in the DOM
  if(isAllPages){
    const p1 = $('p1');
    if(p1 && p1.parentNode){
      p1.parentNode.insertBefore(pl, p1);
    }
  } else {
    const curPage = $(current);
    if(curPage && curPage.parentNode){
      curPage.parentNode.insertBefore(pl, curPage);
    }
  }

  const isEn = (currentLang === 'en');
  const pageObj = PAGES.find(p => p[0] === current);
  
  let pageTitle, pageSubtitle;
  if(isAllPages){
    pageTitle = isEn 
      ? 'COMPREHENSIVE MULTI-PAGE DOSSIER (ALL ASSESSMENT AREAS · TABLES 1–11)' 
      : 'DOSSIER LENGKAP SEMUA AREA ASESMEN (TABEL 1–11)';
    pageSubtitle = isEn 
      ? 'Complete PDM Assessment Report Covering Demographics & 6 Strategic CVP Dimensions' 
      : 'Laporan Asesmen PDM Komprehensif Meliputi Demografi & 6 Dimensi Strategis CVP';
  } else {
    pageTitle = pageObj ? tr(pageObj[2] || pageObj[1]) : '';
    pageSubtitle = pageObj ? tr(pageObj[3] || '') : '';
  }
  
  const now = new Date();
  const dateStr = isEn 
    ? now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const R = filtered();
  const aps = new Set(R.map(r => r.ap));
  const filterSummary = esc(datasetMeta.label[currentLang])+' · '+(state.ap.size ? [...state.ap].map(v=>v==='__none__'?(isEn?'None selected':'Tidak ada pilihan'):v).map(esc).join(', ') : (isEn ? 'All Program Areas' : 'Semua Area Program'))
    + (state.fy.size ? ' · FY ' + [...state.fy].map(esc).join('/') : '')
    + (state.fsp.size ? ' · FSP: ' + [...state.fsp].map(esc).join(', ') : '')
    + (state.lama.size ? ' · ' + (isEn ? 'Old Modality: ' : 'Modalitas Lama: ') + [...state.lama].map(v=>tr(v)).join('/') : '');

  const labelSection = isEn ? 'REPORT SECTION' : 'BAGIAN LAPORAN';
  const labelDate = isEn ? 'DATE OF REPORT' : 'TANGGAL DOKUMEN';
  const labelScope = isEn ? 'ACTIVE FILTER SCOPE' : 'CAKUPAN FILTER AKTIF';
  const labelSample = isEn ? 'SAMPLE BASE' : 'BASIS SAMPEL';
  const sampleTxt = isEn 
    ? `<b>${R.length}</b> of ${DATA.length} Beneficiaries (${pctS(R.length, DATA.length)}) · ${aps.size} Program Areas`
    : `<b>${R.length}</b> dari ${DATA.length} Penerima Manfaat (${pctS(R.length, DATA.length)}) · ${aps.size} Area Program`;

  const orgTitle = 'WAHANA VISI INDONESIA';
  const orgSub = isEn ? 'Strategic Partner of World Vision · Indonesia National Office' : 'Mitra Strategis World Vision · Kantor Nasional Indonesia';
  const docTitle = isEn 
    ? 'POST-DISTRIBUTION MONITORING (PDM) REPORT' 
    : 'LAPORAN HASIL MONITORING PASCA-DISTRIBUSI (PDM)';
  const docSub = isEn 
    ? `CASH & VOUCHER PROGRAMMING (CVP) FOR GIFT NOTIFICATION · ${esc(datasetMeta.cycle)} CYCLE` 
    : `CASH & VOUCHER PROGRAMMING (CVP) UNTUK GIFT NOTIFICATION · SIKLUS ${esc(datasetMeta.cycle)}`;

  pl.innerHTML = `
    <div class="pl-kop">
      <div class="pl-logo-col">
        <img class="pl-logo" src="wvi-logo-navy.png" alt="Wahana Visi Indonesia">
      </div>
      <div class="pl-title-col">
        <div class="pl-org">${orgTitle}</div>
        <div class="pl-org-sub">${orgSub}</div>
        <div class="pl-doc-title">${docTitle}</div>
        <div class="pl-doc-sub">${docSub}</div>
      </div>
    </div>
    <div class="pl-divider"></div>
    <div class="pl-meta-grid">
      <div class="pl-meta-item">
        <span class="pl-lbl">${labelSection}</span>
        <span class="pl-val"><b>${pageTitle}</b>${pageSubtitle ? ' · ' + pageSubtitle : ''}</span>
      </div>
      <div class="pl-meta-item">
        <span class="pl-lbl">${labelDate}</span>
        <span class="pl-val">${dateStr}</span>
      </div>
      <div class="pl-meta-item">
        <span class="pl-lbl">${labelScope}</span>
        <span class="pl-val">${filterSummary}</span>
      </div>
      <div class="pl-meta-item">
        <span class="pl-lbl">${labelSample}</span>
        <span class="pl-val">${sampleTxt}</span>
      </div>
    </div>
  `;
}

// Single Page Print Action
const btnPrint = $('btn-print-pdf');
if(btnPrint) {
  btnPrint.addEventListener('click', ()=>{
    document.body.classList.remove('print-all-pages');
    updatePrintLetterhead(false);
    window.print();
  });
}

// Full Multi-Page Dossier Print Action
const btnPrintAll = $('btn-print-all');
if(btnPrintAll) {
  btnPrintAll.addEventListener('click', ()=>{
    document.body.classList.add('print-all-pages');
    updatePrintLetterhead(true);
    window.print();
  });
}

window.addEventListener('beforeprint', ()=>{
  const isAll = document.body.classList.contains('print-all-pages');
  updatePrintLetterhead(isAll);
});

window.addEventListener('afterprint', ()=>{
  document.body.classList.remove('print-all-pages');
  updatePrintLetterhead(false);
});

/* Sticky Compact Filter Bar on Scroll (> 200px) */
let scrollTicking = false;
function handleStickyCompactScroll(){
  if(!scrollTicking){
    window.requestAnimationFrame(()=>{
      const fb = $('fbar');
      if(fb){
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        fb.classList.toggle('compact', scrolled > 200);
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}
window.addEventListener('scroll', handleStickyCompactScroll, { passive: true });

/* Slicer search & quick actions delegation */
$('slicers').addEventListener('input', e=>{
  const inp = e.target;
  if(!inp || !inp.classList.contains('sl-search-inp')) return;
  const q = inp.value.trim().toLowerCase();
  const pop = inp.closest('.sl-pop');
  if(!pop) return;
  pop.querySelectorAll('.sl-i[data-label]').forEach(row=>{
    const lbl = row.getAttribute('data-label') || '';
    row.style.display = (!q || lbl.includes(q)) ? 'flex' : 'none';
  });
});

$('slicers').addEventListener('click', e=>{
  const btn = e.target.closest('.sl-act-link');
  if(!btn) return;
  e.stopPropagation();
  const act = btn.dataset.quick;
  const key = btn.dataset.f;
  if(act === 'all'){
    state[key].clear();
  } else if(act === 'clear'){
    state[key].clear();
    state[key].add('__none__');
  }
  render();
  saveState();
});

// Update render and go to auto-save state
const origGo = go;
go = function(id){
  origGo(id);
  saveState();
};

$('slicers').addEventListener('click',onSlicerClick);
$('slicers').addEventListener('change',e=>{
  onSlicerChange(e);
  saveState();
});
$('f-reset').addEventListener('click',()=>{
  resetFilters();
  render();
  saveState();
});


// Install a complete validated snapshot atomically. Failed loads retain the last good data.
let catalog=null, requestVersion=0, activeRequest=null;
function updateDatasetUI(){
  if(!catalog) return;
  const select=$('dataset-select');
  select.replaceChildren(...catalog.datasets.map(entry=>{
    const option=document.createElement('option');option.value=entry.id;
    option.textContent=entry.label[currentLang];return option;
  }));
  select.value=datasetMeta.id || catalog.defaultDataset;
  if(datasetMeta.id){
    const live=datasetMeta.live===true?(currentLang==='en'?'Live · ':'Live · '):datasetMeta.live===false?(currentLang==='en'?'Cached copy · ':'Salinan cadangan · '):'';
    $('dataset-status').textContent=live+(currentLang==='en'?'Updated ':'Diperbarui ')+datasetMeta.updatedAt+' · '+DATA.length+(currentLang==='en'?' respondents':' responden');
  }
}
async function selectDataset(id,initial=false){
  const entry=catalog.datasets.find(item=>item.id===id);
  if(!entry) return;
  const version=++requestVersion;
  activeRequest?.abort(); activeRequest=new AbortController();
  $('dataset-select').disabled=true;
  $('dataset-status').textContent=currentLang==='en'?'Loading data…':'Memuat data…';
  $('pages').setAttribute('aria-busy','true');
  try{
    const dataset=await loadDataset(entry,activeRequest.signal);
    if(version!==requestVersion) return;
    resetFilters(); installDataset(dataset);
    if(initial) loadState();
    updateLangUI(); updateDatasetUI(); buildNav(); syncDrawer(); render(); saveState();
  }catch(error){
    if(error.name==='AbortError'||version!==requestVersion) return;
    $('dataset-status').textContent=(currentLang==='en'?'Could not load data. ':'Data gagal dimuat. ')+error.message;
    if(datasetMeta.id){$('dataset-select').value=datasetMeta.id;}
    else showLoadError(error);
  }finally{
    if(version===requestVersion){$('dataset-select').disabled=false;$('pages').setAttribute('aria-busy','false');}
  }
}
function showLoadError(error){
  $('pages').innerHTML='<div class="empty" role="alert"><strong>Data gagal dimuat / Unable to load data</strong><p></p><button type="button" class="f-act-btn" id="retry-data">Coba lagi / Retry</button></div>';
  $('pages').querySelector('p').textContent=error.message;
  $('retry-data').addEventListener('click',initialize);
}
async function initialize(){
  try{
    catalog=await loadCatalog();
    let saved={};try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch{}
    const id=catalog.datasets.some(entry=>entry.id===saved.datasetId)?saved.datasetId:catalog.defaultDataset;
    updateDatasetUI(); await selectDataset(id,true);
  }catch(error){showLoadError(error);$('pages').setAttribute('aria-busy','false');}
}
$('dataset-select').addEventListener('change',e=>selectDataset(e.target.value));
initialize();
