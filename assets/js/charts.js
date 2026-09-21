import {tr} from './i18n.js';
import {dec} from './format.js';
export function hb(items,opt){
  opt=opt||{};
  const mx = opt.max || Math.max(1,...items.map(i=>i.v));
  return '<div class="hb'+(opt.tight?' tight':'')+'">'+items.map(i=>{
    const zero = i.v===0;
    const w = Math.max(0,Math.min(100,i.v/mx*100));
    const cls = zero?'g':(i.cls||'');
    const rawLbl = i.lbl!=null ? i.lbl
      : (opt.max ? i.v+' <em>('+dec(i.v/opt.max*100,1)+'%)</em>' : i.v);
    const lbl = tr(String(rawLbl));
    const k = tr(i.k);
    return '<div class="k">'+k+'</div><div class="b"><i class="'+cls+'" style="width:'+
      w.toFixed(1)+'%"></i></div><span class="bar-value">'+lbl+'</span>';
  }).join('')+'</div>';
}
export function funnel(items){
  const f=['','f2','f2','f3','f4'];
  return '<div class="fnl">'+items.map((i,ix)=>{
    const w=Math.max(0,Math.min(100,i.w));
    const p=('pct' in i ? i.pct : i.w);
    const num=tr(String(i.n))+(p!=null? ' <em>('+dec(p,1)+'%)</em>':' <em>—</em>');
    return '<div class="s"><div class="funnel-label">'+tr(i.k)+'</div><div class="n">'+num+
      '</div><div class="funnel-track"><div aria-hidden="true" class="bar '+(i.cls||f[Math.min(ix,4)])+
      '" style="width:'+w.toFixed(1)+'%"></div></div></div>';
  }).join('')+'</div>';
}
export function donut(a,b,la,lb,ctrLabel){
  const t=a+b, pa=t?a/t*100:0;
  return '<div class="dn"><div class="ring" style="background:conic-gradient(var(--o) 0 '+
    pa.toFixed(1)+'%,var(--d-4) '+pa.toFixed(1)+'% 100%)"><div class="ctr"><b>'+a+
    '</b><small>'+tr(ctrLabel)+'</small></div></div><ul><li><i style="background:var(--o)"></i>'+
    tr(la)+' <b>'+a+'</b></li><li><i style="background:var(--d-4)"></i>'+tr(lb)+' <b>'+b+'</b></li></ul></div>';
}
export function heatBg(v,n){
  if(n===0) return 'background:#FAFAFC;color:var(--d-3)';
  const r=v/n;
  if(r>=1) return 'background:#FAFAFC;color:var(--d-3)';
  if(r>=0.75) return 'background:#FFE9DC';
  if(r>=0.5) return 'background:#FFD0B5';
  return 'background:#FFB38A';
}
