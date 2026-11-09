import { useRef, useState } from 'react';
import { champions } from '../data.js';
import { RankingDivision } from '../pages/Ranking.jsx';
import { flagPath } from './FighterFlag.jsx';
import ChampionFlag from './ChampionFlag.jsx';
import HoloFoil from './HoloFoil.jsx';
import './champions.css';

function moveHologram(event) {
  if (event.pointerType === 'touch') return;
  const card = event.currentTarget;
  const rect = card.querySelector('.champ-holo').getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  card.style.setProperty('--holo-x', `${x * 100}%`);
  card.style.setProperty('--holo-y', `${y * 100}%`);
  card.style.setProperty('--foil-x', `${25 + x * 50}%`);
  card.style.setProperty('--foil-y', `${25 + y * 50}%`);
}

function resetHologram(event) {
  ['--holo-x', '--holo-y', '--foil-x', '--foil-y'].forEach(property => event.currentTarget.style.removeProperty(property));
}

export default function Champions() {
  const dialog = useRef(null);
  const [division, setDivision] = useState(null);

  function openRoster(champion) {
    setDivision(champion.id);
    dialog.current.showModal();
  }

  return (
    <section id="champions" className="champ-section container" aria-labelledby="champ-title">
      <div className="champ-heading"><h2 id="champ-title" className="section-title">CHAMP</h2></div>
      <div className="champ-roster">
        {champions.map((champion, index) => {
          const flag = flagPath(champion.countryCode);
          return <article key={champion.id} className={`champ-tile${champion.name ? '' : ' is-vacant'}`} onPointerMove={champion.name ? moveHologram : undefined} onPointerLeave={champion.name ? resetHologram : undefined} onBlur={champion.name ? resetHologram : undefined}>
            {flag && <ChampionFlag src={flag} index={index} />}
            <div className="champ-tile-base" />
            <h3 className="champ-weight">{champion.weight === 'UNDERGROUND' ? <>UNDER<br />GROUND</> : champion.weight}</h3>
            <img className="champ-portrait" src={champion.image} alt="" width="456" height="700" loading="lazy" />
            {champion.name && <HoloFoil intensity={0.35} edgeSparkle={0.8} frame={4} glare={0.5} />}
            <div className="champ-identity"><p>{champion.name ?? '–'}</p>{champion.realName && <span>{champion.realName}</span>}</div>
            <button className="champ-roster-trigger" type="button" aria-haspopup="dialog" aria-label={`${champion.weight} ${champion.name ? champion.name + ' · ' : ''}체급 선수 목록`} onClick={() => openRoster(champion)} />
          </article>;
        })}
      </div>
      <div className="champ-rankings"><a href="/ranking">랭킹보기</a></div>
      <dialog ref={dialog} className="champ-roster-dialog" aria-label="체급 선수 목록" data-lenis-prevent onClose={() => setDivision(null)} onClick={event => {
        if (event.target === event.currentTarget) dialog.current.close();
      }}>
        <div className="champ-roster-panel">
          <button className="champ-roster-close" type="button" aria-label="선수 목록 닫기" autoFocus onClick={() => dialog.current.close()}>×</button>
          {division && <RankingDivision divisionKey={division} showAll />}
        </div>
      </dialog>
    </section>
  );
}
