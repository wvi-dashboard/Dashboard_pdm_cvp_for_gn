import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for(const directory of ['assets/js','scripts','tests']){
 for(const file of await fs.readdir(directory)){
  if(!/\.m?js$/.test(file)) continue;
  const result=spawnSync(process.execPath,['--check',directory+'/'+file],{stdio:'inherit'});
  if(result.status!==0) process.exit(result.status||1);
 }
}
console.log('JavaScript syntax checks passed');
