import { useEffect, useState } from 'react';
import dataset from '../../data/imports/blackcombat-fighters.json';
import './ranking.css';

const divisionLabels = { fly: 'FLYWEIGHT', bantam: 'BANTAMWEIGHT', feather: 'FEATHERWEIGHT', light: 'LIGHTWEIGHT', welter: 'WELTERWEIGHT', middle: 'MIDDLEWEIGHT', heavy: 'HEAVYWEIGHT', underground: 'UNDERGROUND', women: 'WOMEN' };
const divisions = [...new Map(dataset.rankings.map(row => [row.divisionKey, row.division])).entries()];
const fighters = new Map(dataset.fighters.map(fighter => [fighter.fighterId, fighter]));
const updated = dataset.metadata.collectedAt.slice(0, 10).replaceAll('-', '.');
const normalize = value => value.toLocaleLowerCase().replace(/\s+/g, '');

function Portrait({ id }) {
  const [failed, setFailed] = useState(false);
  const src = fighters.get(id)?.profileImage?.localPath;
  return src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span className="ranking-silhouette" aria-hidden="true" />;
}

function Division({ divisionKey, name, query }) {
  const [expanded, setExpanded] = useState(false);
  const all = dataset.rankings.filter(row => row.divisionKey === divisionKey);
  const champion = all.find(row => row.champion);
  const matches = row => normalize(`${row.ringName} ${row.name}`).includes(normalize(query));
  const contenders = all.filter(row => !row.champion && matches(row));
  const visible = query || expanded ? contenders : contenders.filter(row => row.rank <= 10);
  const remaining = contenders.filter(row => row.rank > 10).length;
  if (query && !all.some(matches)) return null;
  return <section className="ranking-division" data-division={divisionKey} aria-labelledby={`division-${divisionKey}`}>
    <header className="ranking-division-heading"><p>{divisionLabels[divisionKey]}</p><h2 id={`division-${divisionKey}`}>{name}</h2></header>
    {champion ? <a className="ranking-champion" href={champion.profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`${champion.ringName} 챔피언 공식 프로필 · 새 탭`}>
      <div className="ranking-champion-copy"><span>CHAMPION</span><h3>{champion.ringName}</h3><p>{champion.name}</p><small>{champion.recordRaw}</small></div><Portrait id={champion.fighterId} />
    </a> : <div className="ranking-champion is-vacant"><div className="ranking-champion-copy"><span>VACANT</span><h3>챔피언 공석</h3><p>새로운 왕좌의 주인을 기다립니다.</p></div></div>}
    <div className="ranking-list-labels" aria-hidden="true"><span>RANK</span><span>FIGHTER</span><span>RECORD</span></div>
    <ol className="ranking-list" id={`ranking-list-${divisionKey}`}>
      {visible.map(row => <li key={row.fighterId} value={row.rank}><a href={row.profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`${name} ${row.rank}위 ${row.ringName}, ${row.name}, 전적 ${row.recordRaw} · 공식 프로필 새 탭`}>
        <span className="ranking-position">{String(row.rank).padStart(2, '0')}</span><div className="ranking-row-photo"><Portrait id={row.fighterId} /></div><div className="ranking-row-name"><h3>{row.ringName}</h3><p>{row.name}</p></div><div className="ranking-row-record"><span>{row.recordRaw}</span><small className={row.rankChange?.startsWith('▲') ? 'up' : row.rankChange?.startsWith('▼') ? 'down' : ''}>{row.rankChange}</small></div>
      </a></li>)}
    </ol>
    {!query && remaining > 0 && <button className="ranking-more" type="button" aria-expanded={expanded} aria-controls={`ranking-list-${divisionKey}`} onClick={() => setExpanded(value => !value)}>{expanded ? '접기' : `더보기 · ${remaining}명`} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
  </section>;
}

export default function Ranking() {
  const [query, setQuery] = useState('');
  const matching = dataset.rankings.filter(row => normalize(`${row.ringName} ${row.name}`).includes(normalize(query)));
  useEffect(() => { const previous = document.title; document.title = 'RANKING | BLACK COMBAT'; return () => { document.title = previous; }; }, []);
  return <section className="ranking-page" aria-labelledby="ranking-title"><div className="ranking-container">
    <header className="ranking-heading"><p className="ranking-kicker">BLACK COMBAT · THE CONTENDERS</p><h1 id="ranking-title" className="section-title">RANKING</h1><div className="ranking-intro"><span>{dataset.metadata.uniqueFighterCount} FIGHTERS <i /> 9 DIVISIONS</span></div></header>
    <div className="ranking-toolbar"><p role="status">{query ? `검색 결과 ${matching.length}건` : '전체 체급 랭킹'}</p><label className="ranking-search"><span className="ranking-sr-only">선수 이름 또는 링네임 검색</span><span aria-hidden="true">⌕</span><input type="search" placeholder="선수명 / 링네임 검색" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
    {matching.length ? <div className="ranking-divisions">{divisions.map(([key, name]) => <Division key={key} divisionKey={key} name={name} query={query} />)}</div> : <div className="ranking-no-results"><p>검색 결과가 없습니다.</p><button type="button" onClick={() => setQuery('')}>전체 선수 보기</button></div>}
    <footer className="ranking-source"><p>공식 랭킹 기준 · {updated} 수집본</p><p>전적은 공식 페이지의 표기를 따릅니다. 복수 체급 등록 선수가 포함되어 있습니다.</p><a href={dataset.metadata.sourceUrl} target="_blank" rel="noopener noreferrer">BLACK COMBAT 공식 랭킹 ↗</a></footer>
  </div></section>;
}
