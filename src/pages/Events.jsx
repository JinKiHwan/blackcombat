import {useEffect,useRef,useState} from 'react';
import catalog from '../../data/imports/blackcombat-events.json';
import './events.css';
import EventTitle from '../components/EventTitle.jsx';
import {eventTitle} from '../utils/eventTitle.js';
export const eventHref = event => event.category === 'N' && /블랙컴뱃 17:/.test(event.title) ? '/numbering/17' : '/events/' + event.id;
export default function Events(){
 const [category,setCategory]=useState('N');const [query,setQuery]=useState('');const [limit,setLimit]=useState(12);const notice=useRef(null);
 const selected=catalog.events.filter(e=>e.category===category&&(e.title+' '+eventTitle(e.title)).toLowerCase().includes(query.toLowerCase()));
 useEffect(()=>{const title=document.title;document.title='EVENTS | BLACK COMBAT';return()=>{document.title=title;};},[]);
 function unavailable(e){e.preventDefault();notice.current.showModal();}
 return <section className="events-page"><div className="events-container"><header className="events-heading"><p>BLACK COMBAT · THE ARCHIVE</p><h1 className="section-title">EVENTS</h1><div><span>우리가 싸워온 모든 순간.</span><small>{catalog.events.length} EVENTS / 5 SERIES</small></div></header>
 <div className="events-tools"><label><span className="events-sr">이벤트 카테고리</span><select value={category} onChange={e=>{setCategory(e.target.value);setLimit(12);}}>{catalog.categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label><a className="events-latest" href={eventHref(catalog.events[0])}>LATEST ↗</a><label className="events-search"><span className="events-sr">이벤트 검색</span><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12);}} placeholder="이벤트명 검색" /></label></div>
 <div className="events-section-label"><h2>{catalog.categories.find(c=>c.id===category).label}</h2><span role="status">{selected.length} EVENTS</span></div>
 <div className="events-grid">{selected.slice(0,limit).map((event,index)=><a className="event-card" key={event.id} href={eventHref(event)} onClick={event.detailStatus==='available'?undefined:unavailable}><div className="event-poster">{event.poster?<img src={event.poster} alt="" loading={index<3?'eager':'lazy'} onError={e=>{e.currentTarget.style.visibility='hidden';}}/>:<span>BLACK COMBAT</span>}<span className="event-series">{event.categoryLabel}</span></div><div className="event-card-copy"><small>{event.date}</small><h3><EventTitle title={event.title} /></h3><p>{event.venue||'장소 미공개'}</p><div><span>{event.matches?.length ? `${eventHref(event) === '/numbering/17' ? 5 : event.matches.length} MATCHES`:'EVENT ARCHIVE'}</span><span>상세보기 ↗</span></div></div></a>)}</div>
 {!selected.length&&<p className="events-empty">검색 결과가 없습니다.</p>}{limit<selected.length&&<button className="events-more" type="button" onClick={()=>setLimit(n=>n+12)}>이벤트 더보기 +</button>}
 <p className="events-source">공식 이벤트 수집본 · {catalog.collectedAt.slice(0,10)} <a href={catalog.sourceUrl} target="_blank" rel="noopener noreferrer">공식 페이지 ↗</a></p>
 <dialog ref={notice} className="numbering-dialog"><h2>이벤트 안내</h2><p>데이터가 없습니다.</p><div className="numbering-dialog-actions"><button type="button" onClick={()=>notice.current.close()}>확인</button></div></dialog>
 </div></section>;
}

