import {currentLang} from './i18n.js';
export const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export const nf = n => Number(n).toLocaleString(currentLang==='en'?'en-US':'id-ID');
export const dec = (n,d=1) => Number(n).toLocaleString(currentLang==='en'?'en-US':'id-ID',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:false});
export function rp(v){
  if(v==null) return '—';
  if(currentLang === 'en'){
    if(v>=1e6) return 'IDR '+dec(v/1e6,2)+'M';
    if(v>=1e3) return 'IDR '+nf(Math.round(v/1e3))+'k';
    return 'IDR '+nf(v);
  }
  if(v>=1e6) return 'Rp '+dec(v/1e6,2)+' jt';
  if(v>=1e3) return 'Rp '+nf(Math.round(v/1e3))+' rb';
  return 'Rp '+nf(v);
}
export const of_ = (n,d)=> d ? n+' <em>('+dec(n/d*100,1)+'%)</em>' : String(n);
export function pctS(n,d){return d?dec(n/d*100,1)+'%':'—';}
