// This module has no DOM dependency; the same validation runs in the browser and CLI.
export function validateDataset(value, schema) {
  const errors=[];
  if(!value || typeof value!=='object') throw new Error('Dataset must be a JSON object.');
  if(value.schemaVersion!==1) errors.push('schemaVersion must be 1');
  for(const key of ['id','cycle','updatedAt','source']) if(typeof value[key]!=='string'||!value[key].trim()) errors.push(`${key} must be a non-empty string`);
  if(!value.label || ['id','en'].some(lang=>typeof value.label[lang]!=='string'||!value.label[lang].trim())) errors.push('label.id and label.en are required');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value.updatedAt||'') || !Number.isFinite(Date.parse(value.updatedAt))) errors.push('updatedAt must be YYYY-MM-DD');
  if(!Array.isArray(value.records)) errors.push('records must be an array');
  const ids=new Set();
  for(const [i,row] of (Array.isArray(value.records)?value.records:[]).entries()){
    if(!row || typeof row!=='object' || Array.isArray(row)){errors.push(`Record ${i+1} must be an object`);continue;}
    const prefix=`Record ${i+1} (${row.id||'missing ID'})`;
    if(typeof row.id!=='string'||!row.id.trim()||ids.has(row.id)) errors.push(`${prefix}: id must be non-empty and unique`);
    ids.add(row.id);
    for(const [field,type] of Object.entries(schema.fields)){
      const v=row[field];
      const valid=type==='number|null' ? v===null||(typeof v==='number'&&Number.isFinite(v))
        : type==='string|null' ? v===null||typeof v==='string'
        : type==='string[]' ? Array.isArray(v)&&v.every(x=>typeof x==='string')
        : type==='boolean[6]' ? Array.isArray(v)&&v.length===6&&v.every(x=>typeof x==='boolean')
        : typeof v===type;
      if(!valid) errors.push(`${prefix}: ${field} must be ${type}`);
    }
    for(const field of ['ap','fsp']) if(typeof row[field]!=='string'||!row[field].trim()) errors.push(`${prefix}: ${field} cannot be empty`);
    if(row.danaOk && !(typeof row.dana==='number'&&row.dana>0)) errors.push(`${prefix}: danaOk requires a positive dana value`);
  }
  if(errors.length) throw new Error(errors.slice(0,12).join('\n')+(errors.length>12?`\n…and ${errors.length-12} more errors`:''));
  return value;
}

async function readJSON(url,signal){
  const response=await fetch(url,{signal,cache:'no-cache'});
  if(!response.ok) throw new Error(`Could not load ${new URL(url,location.href).pathname} (HTTP ${response.status}).`);
  return response.json();
}
const dataRoot=new URL('../../data/',import.meta.url);
export async function loadCatalog(signal){
  const catalog=await readJSON(new URL('catalog.json',dataRoot),signal);
  if(catalog.schemaVersion!==1||!Array.isArray(catalog.datasets)||!catalog.datasets.length) throw new Error('Invalid dataset catalog.');
  const ids=new Set();
  for(const entry of catalog.datasets){
    if(!entry.id||ids.has(entry.id)||!entry.label?.id||!entry.label?.en||!safeDatasetPath(entry.path)) throw new Error('Invalid or duplicate catalog entry.');
    ids.add(entry.id);
  }
  if(!ids.has(catalog.defaultDataset)) throw new Error('Default dataset is missing from catalog.');
  return catalog;
}
export function safeDatasetPath(path){return typeof path==='string'&&/^[a-zA-Z0-9_-]+\.json$/.test(path);}
export async function loadDataset(entry,signal){
  if(!safeDatasetPath(entry.path)) throw new Error('Dataset paths must be JSON files in data/.');
  const [value,schema]=await Promise.all([readJSON(new URL(entry.path,dataRoot),signal),readJSON(new URL('schema.json',dataRoot),signal)]);
  validateDataset(value,schema);
  if(value.id!==entry.id) throw new Error('Dataset ID does not match its catalog entry.');
  return value;
}
