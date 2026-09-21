// Creates a disposable preview; it never edits the production catalog or survey records.
import fs from 'node:fs/promises';
import './build.mjs';
const root=new URL('../',import.meta.url);
const sample=JSON.parse(await fs.readFile(new URL('examples/example-2027.json',root),'utf8'));
await fs.copyFile(new URL('examples/example-2027.json',root),new URL('dist/data/example-2027.json',root));
const file=new URL('dist/data/catalog.json',root);
const catalog=JSON.parse(await fs.readFile(file,'utf8'));
catalog.datasets.push({id:sample.id,path:'example-2027.json',label:sample.label});
await fs.writeFile(file,JSON.stringify(catalog,null,2)+'\n');
console.log('Example available in dist/. Run npm run preview and choose SYNTHETIC EXAMPLE.');
