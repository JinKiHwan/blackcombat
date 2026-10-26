import { useState } from 'react';
import './numbering.css';

const portrait = name => `/images/champ/champ_${name}.webp`;
const events = {
  17: {
    id: 17, phase: 'before', title: 'BLACK COMBAT 17: VANTABLACK',
    image: '/images/visual/vantablack.webp', date: '2026. 11. 21', venue: 'GOCHEOK SKY DOME',
    matches: [
      { names: ['시라소니', '아레스'], realNames: ['방성혁', '김태균'], images: [portrait('feather'), portrait('bantam')], stats: [['RANKING', 'CHAMPION', '#01'], ['RECORD', '8–0', '12–3'], ['HEIGHT', '180cm', '180cm'], ['REACH', '180cm', '183cm'], ['TEAM', 'TEAM MAD CHUNCHEON', 'BLACK COMBAT OFFICIAL GYM']] },
      { names: ['킹콩', '플라밍고'], images: [portrait('heavy'), portrait('light')] },
      { names: ['캡틴 코리아', '영보스'], images: [portrait('fly'), portrait('bantam')] },
      { names: ['사쿠라', '공주먹'], images: [portrait('light'), portrait('underground')] },
      { names: ['언더독', '티크로'], images: [portrait('feather'), portrait('fly')] },
      { names: ['미공개', '미공개'], images: [] },
      { names: ['미공개', '미공개'], images: [] },
    ],
  },
};

function Portrait({ src, className = '' }) {
  return src ? <img className={className} src={src} alt="" /> : <div className={`numbering-silhouette ${className}`} aria-hidden="true"><span /></div>;
}

export default function Numbering({ id }) {
  const event = events[id];
  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState('');
  const [vote, setVote] = useState({});
  const [status, setStatus] = useState('');
  if (!event) return <section className="numbering-not-found"><h1>준비 중인 대회입니다.</h1><a href="/numbering/17">넘버링 17 보기</a></section>;
  const match = event.matches[active];
  const stats = match.stats ?? [['RANKING', '—', '—'], ['RECORD', '—', '—'], ['HEIGHT', '—', '—'], ['REACH', '—', '—'], ['TEAM', '—', '—']];
  const left = vote[active] === 0 ? 53 : vote[active] === 1 ? 51 : 52;
  function select(index) { setActive(index); setText(''); setStatus(''); }
  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages(current => ({ ...current, [active]: [...(current[active] ?? []), text.trim()].slice(-3) }));
    setText(''); setStatus('응원을 등록했습니다. 새로고침하면 초기화되는 화면 예시입니다.');
  }
  return (
    <article className="numbering-page" data-event-phase={event.phase}>
      <header className="numbering-hero"><h1 className="sr-only">{event.title} · 경기 전</h1><img src={event.image} alt="BLACK COMBAT XVII VANTABLACK, 2026년 11월 21일 고척 스카이돔" width="1920" height="880" fetchPriority="high" /></header>
      <section id="fight-card" className="numbering-card" aria-labelledby="numbering-fight-title">
        <h2 id="numbering-fight-title">BLACK COMBAT <span className="numbering-title-id">{event.id}</span>: VANTABLACK<br />FIGHT CARD</h2>
        <p className="numbering-demo">경기 전 페이지 · 대진 및 선수 이미지는 퍼블리싱용 목업입니다.</p>
        <div className="numbering-match">
          <button className="numbering-arrow numbering-arrow--prev" onClick={() => select((active - 1 + event.matches.length) % event.matches.length)} aria-label="이전 대진"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
          <Portrait src={match.images[0]} className="numbering-fighter numbering-fighter--left" />
          <div className="numbering-info" key={active}>
            <div className="numbering-names">{match.names.map((name, i) => <div key={i}><h3>{name}</h3><span>{match.realNames?.[i] ?? '선수 정보 준비 중'}</span></div>)}</div>
            <div className="numbering-prediction" role="img" aria-label={`응원 비율 예시 ${left}% 대 ${100 - left}%`}><span style={{ width: `${left}%` }} /></div>
            <div className="numbering-percent"><span>{left}%</span><span>{100 - left}%</span></div>
            <dl className="numbering-stats">{stats.map(([label, a, b]) => <div key={label}><dt>{label}</dt><dd>{a}</dd><dd>{b}</dd></div>)}</dl>
            <div className="numbering-community">
              <ul aria-label="응원 메시지">{(messages[active] ?? [`${match.names[0]}와 ${match.names[1]}의 경기를 응원합니다.`, '멋진 승부 기대합니다.']).map((message, i) => <li key={i}><span>익명#{108 + i} </span>{message}</li>)}</ul>
              <form onSubmit={submit}><label className="sr-only" htmlFor="numbering-cheer">선수에게 응원 메시지 남기기</label><input id="numbering-cheer" value={text} onChange={e => setText(e.target.value)} maxLength={150} required placeholder="선수에게 응원 메시지를 남겨주세요" /><button type="submit">등록</button><button type="button" className="numbering-bet" onClick={() => setStatus('응원할 선수를 선택해주세요.')} >응원하기</button></form>
              <div className="numbering-votes">{match.names.map((name, i) => <button key={i} aria-pressed={vote[active] === i} onClick={() => { setVote(current => ({ ...current, [active]: i })); setStatus(`${name} 선수를 응원합니다. 화면 예시에만 반영됩니다.`); }}>{name} 응원 {vote[active] === i ? '✓' : '+'}</button>)}</div>
              <p className="numbering-status" role="status">{status}</p>
            </div>
          </div>
          <Portrait src={match.images[1]} className="numbering-fighter numbering-fighter--right" />
          <button className="numbering-arrow numbering-arrow--next" onClick={() => select((active + 1) % event.matches.length)} aria-label="다음 대진"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
        </div>
        <div className="numbering-match-list" role="group" aria-label="대진 선택">{event.matches.map((item, i) => <button key={i} aria-pressed={active === i} onClick={() => select(i)}><span className="numbering-match-thumb"><Portrait src={item.images[0]} /><Portrait src={item.images[1]} /></span><span>{item.images.length ? `${item.names[0]} vs ${item.names[1]}` : '미공개'}</span></button>)}</div>
      </section>
      <section className="numbering-venue" aria-labelledby="venue-title"><h2 id="venue-title">{event.venue}</h2><div className="numbering-venue-placeholder"><span>BLACK COMBAT XVII</span><strong>GOCHEOK<br />SKY DOME</strong><p>2026. 11. 21 · 서울 고척 스카이돔</p><small>경기장 이미지 준비 중</small></div></section>
    </article>
  );
}
