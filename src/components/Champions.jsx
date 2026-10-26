import { champions } from '../data.js';
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
  return (
    <section id="champions" className="champ-section container" aria-labelledby="champ-title">
      <div className="champ-heading"><h2 id="champ-title" className="section-title">CHAMP</h2></div>
      <div className="champ-roster">
        {champions.map(champion => (
          <article key={champion.id} className={`champ-tile${champion.name ? '' : ' is-vacant'}`} tabIndex={champion.name ? 0 : undefined} onPointerMove={champion.name ? moveHologram : undefined} onPointerLeave={champion.name ? resetHologram : undefined} onBlur={champion.name ? resetHologram : undefined} aria-label={`${champion.weight} ${champion.name ?? '챔피언 정보 준비 중'}`}>
            <div className="champ-tile-base" />
            <h3 className="champ-weight">{champion.weight === 'UNDERGROUND' ? <>UNDER<br />GROUND</> : champion.weight}</h3>
            <img className="champ-portrait" src={champion.image} alt="" width="456" height="700" loading="lazy" />
            {champion.name && <HoloFoil intensity={0.35} edgeSparkle={0.8} frame={4} glare={0.5} />}
            <div className="champ-identity"><p>{champion.name ?? '–'}</p>{champion.realName && <span>{champion.realName}</span>}</div>
          </article>
        ))}
      </div>
      <details className="champ-rankings"><summary>랭킹보기</summary><p>체급별 랭킹은 준비 중입니다.</p></details>
    </section>
  );
}
