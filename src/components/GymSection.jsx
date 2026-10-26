import { useState } from 'react';
import { site } from '../data.js';
import { Asset, SectionHeading } from './shared.jsx';

export default function GymSection() {
  const [selected, setSelected] = useState('official');
  const official = selected === 'official';
  return (
    <section id="gym" className="section container">
      <SectionHeading eyebrow="04 / WHERE IT BEGINS" actions={
        <div className="gym-tabs" role="group" aria-label="체육관 선택">
          {[['official', 'OFFICIAL GYM'], ['partners', 'PARTNER GYMS']].map(([id, label]) => <button key={id} className={selected === id ? 'active' : ''} data-gym={id} aria-pressed={selected === id} onClick={() => setSelected(id)}>{label}</button>)}
        </div>
      }>ENTER THE <em>GYM</em></SectionHeading>
      <Asset className="gym-visual" image={official ? site.assets.gym : site.assets.partnerGym}>
        <span className="image-caption">GYM IMAGE</span>
        <div className="gym-details">
          <p className="eyebrow" id="gym-type">BLACK COMBAT {official ? 'OFFICIAL GYM' : 'PARTNER GYMS'}</p>
          <h3 id="gym-title">{official ? '모든 시작에는\n자신만의 케이지가 있다.' : '함께 강해지는 곳.\n파트너 체육관.'}</h3>
          <span id="gym-description">{official ? '주소 및 이용 안내 준비 중' : '파트너 체육관 목록 준비 중'}</span>
        </div>
        <span className="gym-arrow" aria-hidden="true">↗</span>
      </Asset>
    </section>
  );
}
