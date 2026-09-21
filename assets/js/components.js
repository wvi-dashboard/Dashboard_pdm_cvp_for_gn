import {currentLang,tr,trTableHead} from './i18n.js';
import {esc,of_} from './format.js';
import {NOSUG} from './metrics.js';
export function tbl(head,body){return '<div class="table-scroll" tabindex="0" role="region" aria-label="'+
  (currentLang==='en'?'Data table; scroll horizontally if needed':'Tabel data; geser horizontal jika diperlukan')+
  '"><table>'+(head?'<thead>'+trTableHead(head)+'</thead>':'')+'<tbody>'+body+'</tbody></table></div>';}
export function kv(pairs){return tbl('',pairs.map(p=>'<tr><td>'+tr(p[0])+'</td><td class="n">'+p[1]+'</td></tr>').join(''));}
export function card(tag,title,st,body,fn,cls){
  const dispTag = tr(tag);
  const dispTitle = tr(title);
  const dispSt = tr(st);
  return '<div class="c'+(cls?' '+cls:'')+'">'+(dispTag?'<span class="tbl-tag">'+dispTag+'</span>':'')+
    '<h3>'+dispTitle+'</h3>'+(dispSt?'<div class="st">'+dispSt+'</div>':'')+body+'</div>';
}
export const row = (cls,cards)=>'<div class="row '+cls+'">'+cards.join('')+'</div>';
export function kpi(items,cls){
  return '<div class="params'+(cls?' '+cls:'')+'">'+items.map(i=>
    '<div class="pm"><div class="tab">'+tr(i.t)+'</div><div class="big'+(i.sm?' sm':'')+'">'+i.v+
    '</div>'+(i.b?'<div class="base">'+tr(i.b)+'</div>':'')+'</div>').join('')+'</div>';
}
export function verbatim(rows,key){
  const seen=new Map();
  rows.forEach(r=>{
    const t=(r[key]||'').trim();
    if(!t || (key==='ubah' && NOSUG.test(t))) return;
    const k=t.toLowerCase();
    seen.set(k,{t:t,n:(seen.get(k)?seen.get(k).n+1:1)});
  });
  const list=[...seen.values()];
  if(!list.length) return '<div class="empty" style="padding:20px">Tidak ada jawaban berisi usulan pada seleksi ini.</div>';
  return '<ul class="vb">'+list.map(x=>'<li>'+esc(x.t)+
    (x.n>1?' <span class="pill d">'+x.n+'× identik</span>':'')+'</li>').join('')+'</ul>';
}
export function stat(items){
  return '<div class="dgs">'+items.map(i=>
    '<div><b>'+i.v+'</b><small>'+tr(i.t)+'</small></div>').join('')+'</div>';
}
export function numBars(vals,unit,base){
  const u = currentLang === 'en' ? (unit === 'anak' ? 'children' : (unit === 'orang' ? 'people' : unit)) : unit;
  return [...new Set(vals)].sort((x,y)=>x-y).map(k=>{
    const v=vals.filter(x=>x===k).length;
    return {k:k+' '+u,v:v,lbl:of_(v,base)};
  });
}

