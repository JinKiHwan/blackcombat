import { useEffect, useState } from 'react';
import catalog from '../../data/imports/blackcombat-events.json';
import FighterFlag, { countryLabel } from '../components/FighterFlag.jsx';
import { fighterHref, fighterProfile } from '../data/fighterProfiles.js';
import { eventTitle } from '../utils/eventTitle.js';
import { eventHref } from './Events.jsx';
import './fighter-detail.css';

function fightHistory(id) {
  return catalog.events.flatMap(event => event.matches.flatMap(match => {
    const side = match.fighterIds.indexOf(id);
    if (side < 0) return [];
    const opponent = side === 0 ? 1 : 0;
    const [year, month, day] = event.date.match(/\d+/g) ?? [];
    const date = Date.parse(`${year}-${month}-${day}T00:00:00+09:00`);
    const outcome = match.winner === side ? 'win'
      : match.winner === opponent ? 'loss'
        : date > Date.now() ? 'upcoming' : 'unknown';
    return [{ event, opponent: match.names[opponent], opponentId: match.fighterIds[opponent], outcome, date }];
  })).sort((a, b) => (b.date || 0) - (a.date || 0));
}

const outcomes = { win: '승리', loss: '패배', upcoming: '예정', unknown: '결과 미등록' };

export default function FighterDetail({ id }) {
  const profile = fighterProfile(id);
  const [imageFailed, setImageFailed] = useState(false);
  const title = profile?.ringName || profile?.name || '선수 정보';

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | BLACK COMBAT`;
    return () => { document.title = previous; };
  }, [title]);

  if (!profile) return <section className="numbering-not-found">
    <h1>선수 정보를 찾을 수 없습니다.</h1>
    <a href="/ranking">랭킹으로 돌아가기</a>
  </section>;

  const fights = fightHistory(id);
  const details = [
    ['전적', profile.record],
    ['신장', profile.height],
    ['나이', profile.age ? `${profile.age}세` : null],
    ['소속팀', profile.team],
  ];
  const portrait = !imageFailed && profile.image ? profile.image : '/images/champ/noname.webp';

  return <article className="fighter-detail" aria-labelledby="fighter-title">
    <a className="fighter-back" href="/ranking">← RANKING <span>선수 랭킹</span></a>
    <header className="fighter-hero">
      <figure className="fighter-portrait">
        <img src={portrait} alt="" width="467" height="700" onError={() => setImageFailed(true)} />
        {profile.imageKind === 'ai-assisted-editorial' && !imageFailed && <figcaption>팬메이드 이미지</figcaption>}
      </figure>
      <div className="fighter-bio">
        <p className="fighter-kicker">BLACK COMBAT · FIGHTER PROFILE</p>
        <h1 id="fighter-title">{title}</h1>
        <p className="fighter-identity"><FighterFlag code={profile.countryCode} />{profile.name}{countryLabel(profile.countryCode) && <span>{countryLabel(profile.countryCode)}</span>}</p>
        {profile.rankings.length > 0 && <ul className="fighter-ranks" aria-label="체급별 랭킹">
          {profile.rankings.map(rank => <li key={rank.divisionKey} className={rank.champion ? 'is-champion' : undefined}>
            {rank.division} <strong>{rank.champion ? 'CHAMPION' : `#${rank.rank}`}</strong>
          </li>)}
        </ul>}
        <dl className="fighter-stats">
          {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}
        </dl>
        {profile.profileUrl && <a className="fighter-official" href={profile.profileUrl} target="_blank" rel="noopener noreferrer">공식 프로필 ↗</a>}
      </div>
    </header>
    <section className="fighter-history" aria-labelledby="fighter-history-title">
      <p className="fighter-kicker">BLACK COMBAT</p>
      <h2 id="fighter-history-title">FIGHT HISTORY</h2>
      {fights.length ? <ol>
        {fights.map(({ event, opponent, opponentId, outcome }, index) => {
          const opponentHref = fighterHref(opponentId);
          return <li key={`${event.id}-${index}`}>
            <span className={`fighter-result is-${outcome}`}>{outcomes[outcome]}</span>
            <div className="fighter-fight-copy">
              <p><span>VS</span> {opponentHref ? <a href={opponentHref}>{opponent}</a> : opponent}</p>
              <small>{event.date}</small>
            </div>
            <a className="fighter-event" href={eventHref(event)}>{eventTitle(event.title)} <span aria-hidden="true">↗</span></a>
          </li>;
        })}
      </ol> : <p className="fighter-history-empty">수집된 블랙컴뱃 경기 기록이 없습니다.</p>}
      <p className="fighter-source">프로필과 경기 기록은 사이트에 수집된 공식 데이터를 기준으로 표시합니다.</p>
    </section>
  </article>;
}
