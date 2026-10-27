import { useRef, useState } from 'react';
import { A11y, EffectFade, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import AnimatedPrediction from '../components/AnimatedPrediction.jsx';
import EventTitle from '../components/EventTitle.jsx';
import {eventTitle} from '../utils/eventTitle.js';
import fighterData from '../../data/imports/blackcombat-fighters.json';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import './numbering.css';

const fightersById = new Map(fighterData.fighters.map(fighter => [fighter.fighterId, fighter]));
function createMatch(division, ...fighterIds) {
  const fighters = fighterIds.map(id => fightersById.get(id));
  const rankings = fighterIds.map(id => fighterData.rankings.find(row => row.fighterId === id && row.divisionKey === division));
  return {
    fighterIds, division,
    names: fighters.map(fighter => fighter.ringName),
    realNames: fighters.map(fighter => fighter.name),
    images: fighters.map(fighter => fighter.profileImage?.localPath),
    stats: [
      ['RANKING', ...rankings.map(row => row?.champion ? 'CHAMPION' : row?.rank ? '#' + String(row.rank).padStart(2, '0') : '—')],
      ['RECORD', ...rankings.map(row => row?.recordRaw ?? '—')],
      ['HEIGHT', ...fighters.map(fighter => fighter.height ?? '—')],
      ['AGE', ...fighters.map(fighter => fighter.age ? `${fighter.age}세` : '—')],
      ['TEAM', ...fighters.map(fighter => fighter.team ?? '—')],
    ],
  };
}
const events = {
  17: {
    id: 17, phase: 'before', title: 'BLACK COMBAT 17: VANTABLACK',
    image: '/images/visual/vantablack.webp', date: '2026. 11. 21', venue: 'GOCHEOK SKY DOME',
    background: '/images/numbering/17bg.png', venueImage: '/images/numbering/gocheck.png',
    matches: [
      createMatch('feather', '79683172', '82685239'),
      createMatch('middle', '91010996', '28865824'),
      createMatch('light', '22363165', '76220784'),
      createMatch('light', '65081168', '89975978'),
      createMatch('bantam', '41530580', '54898276'),
    ],
  },
};

function Portrait({ src, className = '' }) {
  return src ? <img className={className} src={src} alt="" draggable="false" /> : <div className={`numbering-silhouette ${className}`} aria-hidden="true"><span /></div>;
}

export default function Numbering({ id, eventData }) {
  const event = eventData ?? events[id];
  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState('');
  const [vote, setVote] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('blackcombat-votes-' + id) || '{}'); return Object.fromEntries(Object.entries(saved).filter(([key, side]) => /^\d+$/.test(key) && (side === 0 || side === 1))); } catch { return {}; }
  });
  const [pending, setPending] = useState(null);
  const voteDialog = useRef(null);
  const commentsDialog = useRef(null);
  const voteLock = useRef(false);
  const [status, setStatus] = useState('');
  const railRef = useRef(null);
  const stageRef = useRef(null);
  if (!event) return <section className="numbering-not-found"><h1>준비 중인 대회입니다.</h1><a href="/">홈으로</a></section>;
  function requestVote(index, side) {
    if (vote[index] !== undefined || voteDialog.current.open) return;
    voteLock.current = false;
    setPending({ index, side });
    voteDialog.current.showModal();
  }
  function confirmVote() {
    if (!pending || voteLock.current || vote[pending.index] !== undefined) return;
    voteLock.current = true;
    const next = { ...vote, [pending.index]: pending.side };
    setVote(next);
    try { localStorage.setItem('blackcombat-votes-' + id, JSON.stringify(next)); } catch { /* Keep the vote in memory if storage is unavailable. */ }
    setStatus(event.matches[pending.index].names[pending.side] + ' 선수를 응원했습니다.');
    voteDialog.current.close();
  }
  function matchMessages(index) {
    const names = event.matches[index].names;
    return [names[0] + ' 선수 응원합니다!', names[1] + ' 선수 파이팅!', '두 선수 모두 멋진 승부 기대합니다.', ...(messages[index] ?? [])];
  }
  function select(index) { stageRef.current?.slideTo(index); }
  function submit(e, index) {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages(current => ({ ...current, [index]: [...(current[index] ?? []), text.trim()] }));
    setText(''); setStatus('응원을 등록했습니다. 새로고침하면 초기화되는 화면 예시입니다.');
  }
  return (
    <article className={`numbering-page${event.phase === 'archive' ? ' is-archive' : ''}`} data-event-phase={event.phase}>
      <a className="event-back" href="/events">← EVENTS · 이벤트 목록</a><header className={`numbering-hero${event.phase === 'archive' ? ' is-archive' : ''}`}><h1 className="sr-only">{eventTitle(event.title)}</h1><img src={event.image} alt={`${event.title} · ${event.date} · ${event.venue}`} width="1920" height="880" fetchPriority="high" /></header>
      <div className="numbering-event-body" style={{ '--event-background': `url("${event.background}")` }}>
      <section id="fight-card" className="numbering-card" aria-labelledby="numbering-fight-title">
        <h2 id="numbering-fight-title"><EventTitle title={event.title} /><br />FIGHT CARD</h2>
        <div className="numbering-match">
          <button className="numbering-arrow numbering-arrow--prev" disabled={active === 0} onClick={() => stageRef.current?.slidePrev()} aria-label="이전 대진"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
          <Swiper className="numbering-stage" modules={[A11y, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }} speed={550} loop={false} rewind={false} onSwiper={swiper => { stageRef.current = swiper; }} onSlideChange={swiper => { setActive(swiper.activeIndex); setText(''); setStatus(''); railRef.current?.slideTo(swiper.activeIndex); }} a11y={{ containerMessage: '경기 대진', slideLabelMessage: '{{slidesLength}}개 중 {{index}}번째 대진' }}>
          {event.matches.map((match, index) => {
            const stats = match.stats ?? [['RANKING', '—', '—'], ['RECORD', '—', '—'], ['HEIGHT', '—', '—'], ['AGE', '—', '—'], ['TEAM', '—', '—']];
            const left = vote[index] === 0 ? 53 : vote[index] === 1 ? 51 : 52;
            return <SwiperSlide key={index}><div className="numbering-match-content" data-match={index}>
          <Portrait src={match.images[0]} className="numbering-fighter numbering-fighter--left" />
          <div className="numbering-info">
            <div className="numbering-names">{match.names.map((name, i) => <div key={i}>{event.phase === 'archive' && match.winner >= 0 && <strong className={`numbering-outcome ${match.winner === i ? 'is-win' : 'is-loss'}`}>{match.winner === i ? 'WIN · 승자' : 'LOSS · 패자'}</strong>}<h3>{name}</h3><span>{match.realNames?.[i] ?? '선수 정보 준비 중'}</span></div>)}</div>
            {active === index && <AnimatedPrediction key={index} left={left} names={match.names} selected={vote[index]} onVote={event.phase === 'archive' ? undefined : side => requestVote(index, side)} />}
            <dl className="numbering-stats">{stats.map(([label, a, b]) => <div key={label}><dt title={label === 'AGE' ? '공식 프로필 수집 시점 기준 나이' : undefined}>{label}</dt><dd>{a}</dd><dd>{b}</dd></div>)}</dl>
            {event.phase === 'archive' && <p className="numbering-archive-result">{match.result}</p>}
            <div className="numbering-community">
              <ul aria-label="응원 메시지">{matchMessages(index).slice(-3).map((message, i) => <li key={i}><span>익명#{108 + i} </span>{message}</li>)}</ul>
              <form onSubmit={e => submit(e, index)}><label className="sr-only" htmlFor={`numbering-cheer-${index}`}>선수에게 응원 메시지 남기기</label><input id={`numbering-cheer-${index}`} value={text} onChange={e => setText(e.target.value)} maxLength={150} required placeholder="선수에게 응원 메시지를 남겨주세요" /><button type="submit">등록</button><button type="button" className="numbering-bet" onClick={() => commentsDialog.current.showModal()} >전체보기</button></form>
              <p className="numbering-status" role="status">{status}</p>
            </div>
          </div>
          <Portrait src={match.images[1]} className="numbering-fighter numbering-fighter--right" />
          </div></SwiperSlide>; })}
          </Swiper>
          <button className="numbering-arrow numbering-arrow--next" disabled={active === event.matches.length - 1} onClick={() => stageRef.current?.slideNext()} aria-label="다음 대진"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
        </div>
        <Swiper
          className="numbering-match-list"
          onSwiper={swiper => { railRef.current = swiper; }}
          speed={480}
          modules={[A11y, FreeMode]}
          slidesPerView="auto"
          spaceBetween={20}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.65 }}
          grabCursor
          loop={false}
          watchOverflow
          a11y={{ containerMessage: '다른 대진 선택', slideLabelMessage: '{{slidesLength}}개 중 {{index}}번째 대진' }}
        >
          {event.matches.map((item, i) => <SwiperSlide key={i}>
            <button type="button" aria-current={i === active ? 'true' : undefined} data-match-index={i} onClick={() => select(i)}>
              <span className="numbering-match-thumb"><Portrait src={item.images[0] ?? '/images/champ/noname.webp'} /><Portrait src={item.images[1] ?? '/images/champ/noname.webp'} />{event.phase === 'archive' && item.winner >= 0 && <span className="numbering-thumb-outcomes">{[0, 1].map(side => <span key={side} className={`numbering-outcome ${item.winner === side ? 'is-win' : 'is-loss'}`}>{item.winner === side ? 'WIN' : 'LOSS'}</span>)}</span>}</span>
              <span>{item.images.length ? `${item.names[0]} vs ${item.names[1]}` : '미공개'}</span>
            </button>
          </SwiperSlide>)}
        </Swiper>
      </section>
      {event.venueImage && <section className="numbering-venue" aria-labelledby="venue-title"><h2 id="venue-title">{event.venue}</h2><img className="numbering-venue-image" src={event.venueImage} alt="고척 스카이돔 전경" width="1600" height="890" loading="lazy" /></section>}
      </div>
      <dialog ref={voteDialog} className="numbering-dialog" aria-labelledby="vote-dialog-title" onClose={() => setPending(null)}>
        <h2 id="vote-dialog-title">선수 응원</h2><p>한 경기에서 한 명에게만 투표할 수 있습니다.</p><p className="numbering-dialog-question">“{pending ? event.matches[pending.index].names[pending.side] : ''}” 선수를 응원하시겠습니까?</p>
        <div className="numbering-dialog-actions"><button type="button" onClick={() => voteDialog.current.close()}>취소</button><button type="button" className="confirm" onClick={confirmVote}>응원 확정</button></div>
      </dialog>
      <dialog ref={commentsDialog} className="numbering-dialog numbering-comments-dialog" aria-labelledby="comments-dialog-title" data-lenis-prevent>
        <h2 id="comments-dialog-title">전체 응원</h2><p>{event.matches[active].names.join(' vs ')} · 양 선수 응원</p>
        <ul>{matchMessages(active).map((message, index) => <li key={index}><span>익명#{108 + index}</span><p>{message}</p></li>)}</ul>
        <div className="numbering-dialog-actions"><button type="button" onClick={() => commentsDialog.current.close()}>닫기</button></div>
      </dialog>
    </article>
  );
}
