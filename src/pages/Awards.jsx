import {useEffect,useState} from 'react';
import data from '../../data/imports/blackcombat-awards.json';
import './awards.css';
const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:undefined;}catch{return undefined;}};
export default function Awards(){
 const [selected,setSelected]=useState(data.editions[0].id);
 const edition=data.editions.find(e=>e.id===selected);
 useEffect(()=>{const previous=document.title;document.title='GLORIA AWARDS | BLACK COMBAT';return()=>{document.title=previous;};},[]);
 return <section className="awards-page" aria-labelledby="awards-title"><div className="awards-container">
  <header className="awards-heading"><p>BLACK COMBAT · HALL OF GLORY</p><h1 id="awards-title" className="section-title">GLORIA AWARDS</h1></header>
  <div className="awards-controls"><label htmlFor="awards-edition">AWARD EDITION</label><select id="awards-edition" value={selected} onChange={e=>setSelected(e.target.value)}>{data.editions.map(e=><option key={e.id} value={e.id}>{e.label}</option>)}</select><span role="status">{edition.awards.length} CATEGORIES</span></div>
  <div className="awards-grid" key={edition.id}>{edition.awards.map((award,index)=><article className={`award-card${award.title==='MVP'?' award-card--mvp':''}`} key={award.id}>
   <header><span className="award-index">{String(index+1).padStart(2,'0')}</span><h2>{award.title}</h2>{award.note&&<p>{award.note}</p>}</header>
   <div className={`award-recipients${award.recipients.length>1?' is-shared':''}`}>{award.recipients.map((recipient,i)=>{
    const href=safeUrl(recipient.profileUrl);const Tag=href?'a':'div';
    return <Tag className="award-recipient" key={i} {...(href?{href,target:'_blank',rel:'noopener noreferrer','aria-label':`${recipient.name} 공식 프로필 · 새 탭`}:{})}>
     <div className="award-photo">{recipient.image?<img src={recipient.image} alt="" loading="lazy" onError={e=>{e.currentTarget.hidden=true;}}/>:<span className="award-no-photo" aria-hidden="true">BC</span>}</div>
     <div className="award-identity"><h3>{recipient.details.length>1?recipient.details[0]:recipient.name}</h3>{recipient.details.length>1&&<p>{recipient.name}</p>}<small>{recipient.details.at(-1)}</small>{href&&<span className="award-profile-arrow" aria-hidden="true">↗</span>}</div>
    </Tag>;
   })}</div>
   {safeUrl(award.videoUrl)&&<a className="award-video" href={safeUrl(award.videoUrl)} target="_blank" rel="noopener noreferrer">수상 경기 영상 보기 ↗</a>}
  </article>)}</div>
  <footer className="awards-source"><a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">공식 GLORIA AWARDS ↗</a><span>공식 수상 내역 · {data.collectedAt.slice(0,10)} 수집본</span></footer>
 </div></section>;
}
