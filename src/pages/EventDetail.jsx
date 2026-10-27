import catalog from '../../data/imports/blackcombat-events.json';
import fighters from '../../data/imports/blackcombat-fighters.json';
import Numbering from './Numbering.jsx';
import './events.css';
import ages from '../../data/imports/blackcombat-profile-ages.json';
import portraits from '../../data/imports/blackcombat-event-portraits.json';
export default function EventDetail({id}) {
 const source=catalog.events.find(e=>e.id===id);
 if(!source?.matches?.length)return <section className="numbering-not-found"><h1>데이터가 없습니다.</h1><a href="/events">이벤트 목록으로</a></section>;
 const event={id:source.id,phase:'archive',title:source.title,image:source.poster,date:source.date,venue:source.venue,sourceUrl:source.sourceUrl,matches:source.matches.map(match=>({names:match.names,realNames:match.realNames,images:match.fighterIds.map(id=>portraits.profiles[id]?.localPath||fighters.fighters.find(f=>f.fighterId===id)?.profileImage?.localPath||'/images/champ/noname.webp'),stats:[['RANKING',match.ranks[0]||'—',match.ranks[1]||'—'],['RECORD',match.records[0]||'—',match.records[1]||'—'],['HEIGHT',...match.fighterIds.map(id=>fighters.fighters.find(f=>f.fighterId===id)?.height||'—')],['AGE',...match.fighterIds.map(id=>ages.profiles[id]?.age?`${ages.profiles[id].age}세`:'—')],['TEAM',...match.fighterIds.map(id=>fighters.fighters.find(f=>f.fighterId===id)?.team||'—')]],winner:match.winner,result:match.winner>=0?`${match.names[match.winner]} 승리`:'결과 정보 미등록'}))};
 return <Numbering key={id} id={`event-${id}`} eventData={event}/>;
}

