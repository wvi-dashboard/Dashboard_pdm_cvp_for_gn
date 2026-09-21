import {currentLang,tr} from './i18n.js';
export let DATA=[], AP_ALL=[], FSP_ALL=[],datasetMeta={};
export function installDataset(dataset){
 DATA=dataset.records; datasetMeta=dataset;
 AP_ALL=[...new Set(DATA.map(r=>r.ap))].sort((a,b)=>DATA.filter(r=>r.ap===b).length-DATA.filter(r=>r.ap===a).length||a.localeCompare(b));
 FSP_ALL=[...new Set(DATA.map(r=>r.fsp))].sort((a,b)=>DATA.filter(r=>r.fsp===b).length-DATA.filter(r=>r.fsp===a).length||a.localeCompare(b));
}
export const COVER_ID='p0';
export let current=COVER_ID;
export function setPage(id){ current=id; }

export const SLICERS=[
  ['ap','Area Program',()=>AP_ALL],
  ['fsp','FSP yang dipakai',()=>FSP_ALL],
  ['lama','Pernah terima GN modalitas lama',()=>['Ya','Tidak']]
];
export const state={ap:new Set(),fsp:new Set(),lama:new Set()};
export let openSlicer=null;
export function setOpenSlicer(key){openSlicer=key;}

export const anyOn=()=>state.ap.size||state.fsp.size||state.lama.size;
export function pass(r,skip){
  return (skip==='ap'   || state.ap.size===0   || state.ap.has(r.ap))   &&
         (skip==='fsp'  || state.fsp.size===0  || state.fsp.has(r.fsp)) &&
         (skip==='lama' || state.lama.size===0 || state.lama.has(r.lama));
}
export function filtered(){ return DATA.filter(r=>pass(r)); }
export function resetFilters(){
  state.ap.clear(); state.fsp.clear(); state.lama.clear(); openSlicer=null;
}
export function slicerLabel(key){
  const s=state[key];
  if(s.has('__none__')) return currentLang==='en'?'None selected':'Tidak ada pilihan';
  if(s.size===0) return (currentLang==='en' ? 'All' : 'Semua');
  if(s.size===1) {
    const raw = [...s][0];
    return tr(raw);
  }
  return s.size + (currentLang==='en' ? ' selected' : ' dipilih');
}

