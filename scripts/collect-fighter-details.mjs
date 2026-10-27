import {readFile,writeFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
const path='data/imports/blackcombat-fighters.json';
const data=JSON.parse(await readFile(path,'utf8'));
const clean=value=>value?.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;|&#160;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
for(const [index,fighter] of data.fighters.entries()){
 if(fighter.profileDetails?.status==='collected')continue;
 try{
  if(new URL(fighter.profileUrl).origin!=='https://www.blackcombat-official.com')throw Error('Unexpected origin');
  let html;
  for(let attempt=0;attempt<2;attempt++){
   try{const response=await fetch(fighter.profileUrl,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`HTTP ${response.status}`);html=await response.text();break;}catch(error){if(attempt)throw error;await delay(1500);}
  }
  const heightBlock=html.match(/<div\b[^>]*class=["']data_bio_height["'][^>]*>([\s\S]*?)(?=<div\b[^>]*class=["']data_bio_weight)/i)?.[1];
  const teamBlock=html.match(/<div\b[^>]*class=["']data_team["'][^>]*>([\s\S]*?)<\/div>/i)?.[1];
  if(heightBlock===undefined||teamBlock===undefined)throw Error('Profile selectors missing');
  const height=clean(heightBlock)?.replace(/^HEIGHT\s*/i,'').trim();
  const team=clean(teamBlock)?.replace(/^TEAM\s*:\s*/i,'').trim();
  fighter.height=height&&!/^[-—–]$/.test(height)?height:null;
  fighter.team=team&&!/^[-—–]$/.test(team)?team:null;
  fighter.profileDetails={status:'collected',collectedAt:new Date().toISOString(),sourceUrl:fighter.profileUrl};
 }catch(error){fighter.profileDetails={status:'failed',error:error.message,checkedAt:new Date().toISOString(),sourceUrl:fighter.profileUrl};}
 await writeFile(path,JSON.stringify(data,null,2)+'\n');
 console.log(`${index+1}/${data.fighters.length} ${fighter.ringName}: ${fighter.height??'—'} / ${fighter.team??'—'} (${fighter.profileDetails.status})`);
 await delay(350);
}
console.log(JSON.stringify({total:data.fighters.length,height:data.fighters.filter(f=>f.height).length,team:data.fighters.filter(f=>f.team).length,failed:data.fighters.filter(f=>f.profileDetails?.status!=='collected').length}));
