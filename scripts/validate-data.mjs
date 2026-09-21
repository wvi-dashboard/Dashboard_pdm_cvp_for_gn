import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateDataset,safeDatasetPath} from '../assets/js/data.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async file=>JSON.parse(await fs.readFile(path.join(root,file),'utf8'));
const schema=await read('data/schema.json');
const catalog=await read('data/catalog.json');
const ids=new Set();
if(catalog.schemaVersion!==1||!catalog.datasets?.length) throw new Error('Invalid catalog');
for(const entry of catalog.datasets){
  if(ids.has(entry.id)||!safeDatasetPath(entry.path)||!entry.label?.id||!entry.label?.en) throw new Error('Invalid catalog entry');
  ids.add(entry.id);
  const dataset=validateDataset(await read('data/'+entry.path),schema);
  if(dataset.id!==entry.id&&!entry.googleSheet) throw new Error('Dataset and catalog IDs differ');
  console.log(`${entry.id}: ${dataset.records.length} valid records`);
}
if(!ids.has(catalog.defaultDataset)) throw new Error('Default dataset missing');
for(const file of process.argv.slice(2)){
  const dataset=validateDataset(await read(file),schema);
  console.log(`${file}: ${dataset.records.length} valid records`);
}
