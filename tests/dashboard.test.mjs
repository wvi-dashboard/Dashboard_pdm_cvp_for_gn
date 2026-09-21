import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {validateDataset,safeDatasetPath} from '../assets/js/data.js';
import * as state from '../assets/js/state.js';
import * as metrics from '../assets/js/metrics.js';
import {PAGES} from '../assets/js/pages.js';
import {funnel,hb} from '../assets/js/charts.js';
import {verbatim} from '../assets/js/components.js';
import {setLanguage} from '../assets/js/i18n.js';
import {dec,rp,esc} from '../assets/js/format.js';
import {buildCSV,exportFilename} from '../assets/js/export.js';
import {parseCSV,rowsToDataset} from '../assets/js/google-sheets.js';
const read=file=>JSON.parse(fs.readFileSync(new URL('../'+file,import.meta.url)));
const dataset=read('data/pdm-2026.json'),schema=read('data/schema.json'),example=read('examples/example-2027.json');

test('All original survey and demographic values survive extraction exactly',()=>{
  const records=dataset.records.map(({id,...original})=>original);
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(records)).digest('hex'),'943664b1e734e6456f3f3de20a82295548146b8ec2e2f093fee6450af1f9ae49');
  assert.equal(new Set(dataset.records.map(r=>r.id)).size,46);
});
test('Both supplied datasets satisfy the same schema',()=>{
  assert.equal(validateDataset(dataset,schema),dataset);
  assert.equal(validateDataset(example,schema),example);
});
test('Malformed records fail clearly before rendering',()=>{
  for(const modify of [d=>d.records.push(d.records[0]),d=>delete d.records[0].info6,d=>d.records[0].info6=[true],d=>d.records[0].dana='1000',d=>d.records[0].dana=null,d=>d.records[0].pakai='Pangan',d=>delete d.label.en]){
    const invalid=structuredClone(dataset);modify(invalid);assert.throws(()=>validateDataset(invalid,schema));
  }
});
test('Dataset paths cannot leave the local data directory',()=>{
  for(const p of ['../private.json','https://example.com/a.json','/data/a.json']) assert.equal(safeDatasetPath(p),false);
  assert.equal(safeDatasetPath('pdm-2027.json'),true);
});
test('Baseline KPIs and quality exclusions are preserved',()=>{
  setLanguage('id');const m=metrics.calculate_pg1(dataset.records);
  assert.equal(m.n,46);assert.equal(m.aps.length,8);assert.equal(m.dOk.length,42);assert.equal(m.bad,4);
  assert.equal(m.info6all,36);assert.equal(m.kepFspPos,42);assert.equal(m.danaSes,41);
  assert.equal(m.kemampuanPos,26);assert.equal(m.kepPos,43);assert.equal(m.mekAda,30);
  assert.equal(m.mean,'4,6');
  assert.equal(metrics.calculate_page_demografi(dataset.records).keDq,12);
});
test('All ten page renderers support both languages and every AP/FSP subset',()=>{
  assert.deepEqual(PAGES.map(p=>p[0]),['p0','p1','pd','p2','p3','p4','p5','p6','p7','p8']);
  const subsets=[dataset.records,...['ap','fsp','lama'].flatMap(k=>[...new Set(dataset.records.map(r=>r[k]))].map(v=>dataset.records.filter(r=>r[k]===v))),example.records];
  for(const lang of ['id','en']){
    setLanguage(lang);
    for(const rows of subsets){
      state.installDataset({...dataset,records:rows});
      for(const [id,,,,render] of PAGES){const html=render(rows);assert.ok(html.length>0);assert.doesNotMatch(html,/NaN|undefined|Infinity/,`${lang}/${id}`);}
    }
  }
  setLanguage('id');state.installDataset(dataset);
});
test('Cross filtering, clear-none, select-all and reset are distinct',()=>{
  state.installDataset(dataset);state.resetFilters();assert.equal(state.filtered().length,46);
  state.state.ap.add('Simokerto');assert.equal(state.filtered().length,10);
  state.state.lama.add('Ya');assert.ok(state.filtered().every(r=>r.ap==='Simokerto'&&r.lama==='Ya'));
  state.state.ap.clear();state.state.ap.add('__none__');assert.equal(state.filtered().length,0);
  state.resetFilters();assert.equal(state.filtered().length,46);
});
test('Fiscal-year filtering follows the October to September WVI cycle',()=>{
  state.installDataset({...dataset,records:[{...dataset.records[0],fy:'2026'},{...dataset.records[1],fy:'2027'}]});state.resetFilters();
  assert.deepEqual(state.FY_ALL,['2026','2027']);state.state.fy.add('2027');assert.equal(state.filtered().length,1);state.resetFilters();
  state.installDataset(dataset);
});
test('Google Sheet CSV parser handles quoted cells and fiscal years',()=>{
  assert.deepEqual(parseCSV('a,b\r\n"x, y","a""b"\r\n'),[['a','b'],['x, y','a"b']]);
  const headers=['Nama AP','A. DEMOGRAFI RESPONDEN/Apakah Anda/anak Anda pernah menerima GN dari WVI SEBELUM tahun 2025 (dengan metode lama — bantuan barang/gift langsung)?','D. PROSES DISTRIBUSI/Berapa jumlah dana GN yang Anda terima? (IDR)','Tanggal Submit','A. DEMOGRAFI RESPONDEN/Apakah Anda menerima GN dari WVI?','C. PENYEDIA JASA KEUANGAN (FSP)/Penyedia jasa keuangan (FSP) mana yang Anda gunakan untuk mencairkan GN?'];
  const live=rowsToDataset([headers,['Example-12345','Tidak','1,200,000','2026-10-01','Ya','Kantor Pos']],{id:'live',cycle:'2026–2027',label:{id:'Live',en:'Live'},credits:[]});
  assert.equal(live.records[0].fy,'2027');assert.equal(live.records[0].ap,'Example');assert.equal(live.records[0].dana,1200000);
});
test('New dataset discovers new AP/FSP options and new monetary scale',()=>{
  state.installDataset(example);state.resetFilters();
  assert.deepEqual(state.AP_ALL,['Example North','Example South']);
  assert.deepEqual(state.FSP_ALL,['Example Bank','Example Post']);
  const m=metrics.calculate_pg1(state.filtered());assert.equal(m.n,3);assert.equal(metrics.med(m.dOk),3200000);
  assert.match(PAGES[1][4](example.records),/4,00 jt/);
  assert.match(PAGES[0][4](example.records),/2027/);
  state.installDataset(dataset);
});
test('New multi-response categories are included, not silently omitted',()=>{
  const result=metrics.multi([{pakai:['New category']}],'pakai',['Pangan pokok']);
  assert.equal(result.find(r=>r.k==='New category').v,1);
});
test('Complaint funnel percentages match stage-specific denominators',()=>{
  setLanguage('en');state.installDataset(example);
  const html=PAGES.find(p=>p[0]==='p7')[4](example.records);
  assert.match(html,/1\/2 <em>\(50\.0%\)/);assert.match(html,/1\/1 <em>\(100\.0%\)/);
  assert.doesNotMatch(funnel([{k:'No users',n:'0/0',w:0,pct:null}]),/NaN|Infinity/);
  setLanguage('id');state.installDataset(dataset);
});
test('Zero bars have zero width and positive feedback is retained',()=>{
  assert.match(hb([{k:'Zero',v:0}],{max:46}),/width:0\.0%/);
  assert.match(verbatim([{baik:'Sudah baik'}],'baik'),/Sudah baik/);
  assert.equal(metrics.noSugCount([{baik:'Sudah baik'}],'baik'),0);
  assert.equal(metrics.noSugCount([{ubah:'Tidak ada'}],'ubah'),1);
});
test('Locale formatting and attribute escaping are correct',()=>{
  setLanguage('en');assert.equal(dec(12.5),'12.5');assert.equal(rp(3200000),'IDR 3.20M');
  setLanguage('id');assert.equal(dec(12.5),'12,5');assert.equal(rp(3200000),'Rp 3,20 jt');
  assert.equal(esc('"<tag>'), '&quot;&lt;tag&gt;');
});
test('CSV export preserves quoting, quality flags, filtering input, and filename metadata',()=>{
  const rows=[{...dataset.records[0],ap:'Area "A", North',baik:'not exported'}];
  const csv=buildCSV(rows,'en');
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv,/"Area ""A"", North"/);
  assert.equal(csv.split('\r\n').length,2);
  assert.match(csv,/"Valid"/);
  assert.equal(exportFilename('pdm 2027','Area / North',new Date('2027-01-02T00:00:00Z')),'PDM_CVP_GN_pdm_2027_Area___North_2027-01-02.csv');
});
