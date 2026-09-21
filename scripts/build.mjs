// Static output is identical to GitHub Pages source deployment. No bundler or framework required.
import fs from 'node:fs/promises';
import './validate-data.mjs';
const root=new URL('../',import.meta.url),out=new URL('dist/',root);
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
for(const file of ['index.html','assets','data','wvi-logo-navy.png','wvi-logo-white.png']){
  await fs.cp(new URL(file,root),new URL(file,out),{recursive:true});
}
console.log('Static dashboard built in dist/');
