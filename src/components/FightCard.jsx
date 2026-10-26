import { useState } from 'react';
import { matches } from '../data.js';
import { useCommunity } from '../hooks/useCommunity.js';
import { Asset, SectionHeading } from './shared.jsx';

function Fighter({ fighter, side }) {
  return (
    <div className={`fighter-panel ${side}`}>
      <span className="fighter-rank" id={`rank-${side}`}>{fighter.rank}</span>
      <Asset image={fighter.image} className="fighter-art" id={`fighter-${side}`} aria-hidden="true" />
      <div className="fighter-name"><span id={`english-${side}`}>{fighter.english}</span><h3 id={`name-${side}`}>{fighter.name}</h3></div>
    </div>
  );
}

function Prediction({ match, chosen, onVote }) {
  const [status, setStatus] = useState('');
  const votes = match.votes.map((count, side) => count + (chosen === side ? 1 : 0));
  const total = votes[0] + votes[1];
  const left = total ? Math.round(votes[0] / total * 100) : 50;

  function handleVote(side) {
    try {
      onVote(side);
      setStatus(`${match.fighters[side].name} 선수에게 응원을 보냈습니다. 선택은 변경할 수 있습니다.`);
    } catch (error) { setStatus(error.message); }
  }

  return (
    <div className="prediction">
      <div className="prediction-title"><h3>누가 승리할까요?</h3><span id="vote-total">{total.toLocaleString('ko-KR')}개의 응원 · 예시 포함</span></div>
      <div className="prediction-values"><strong id="percent-left">{total ? `${left}%` : '—'}</strong><span>FAN PREDICTION</span><strong id="percent-right">{total ? `${100 - left}%` : '—'}</strong></div>
      <div className="prediction-bar" role="img" aria-label={total ? `${match.fighters[0].name} ${left}%, ${match.fighters[1].name} ${100 - left}%` : '아직 응원이 없습니다'}><span id="prediction-fill" style={{ width: `${left}%` }} /></div>
      <div className="vote-buttons">
        {match.fighters.map((fighter, side) => (
          <button key={fighter.id} id={`vote-${side ? 'right' : 'left'}`} className={`button${chosen === side ? ' selected' : ''}`} aria-pressed={chosen === side} onClick={() => handleVote(side)}>
            {fighter.name} {chosen === side ? '응원 중 ✓' : '응원하기 ↗'}
          </button>
        ))}
      </div>
      <p className="fine-print">팬의 응원 비율이며 실제 경기 승률이 아닙니다. 데모 데이터 + 이 브라우저의 선택만 반영됩니다.</p>
      <p id="vote-status" className="status" role="status">{status}</p>
    </div>
  );
}

function CheerBoard({ comments, onAddComment }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    try {
      onAddComment(text);
      setText('');
      setStatus('응원이 등록되었습니다. 이 브라우저에만 저장됩니다.');
    } catch (error) { setStatus(error.message); }
  }

  return (
    <div className="cheer-board">
      <div><p className="eyebrow">FROM THE CORNER</p><h3>당신의 목소리를<br />케이지까지.</h3><p className="muted">익명으로 남기는 한마디의 응원.</p><span className="demo-badge">LOCAL DEMO · 브라우저에만 저장</span></div>
      <div className="comments-panel">
        <form id="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="comment">선수에게 응원 보내기</label>
          <div className="comment-input"><input id="comment" name="comment" maxLength={200} required placeholder="존중을 담은 응원을 남겨주세요" autoComplete="off" value={text} onChange={event => setText(event.target.value)} /><button type="submit" aria-label="응원 댓글 등록">↗</button></div>
          <div className="input-meta"><span>익명으로 등록됩니다</span><span id="char-count">{text.length} / 200</span></div>
        </form>
        <p id="comment-status" role="status" className="status">{status}</p>
        <ul id="comments" className="comments">
          {!comments.length && <li className="empty-comment">아직 응원이 없습니다. 첫 번째 목소리를 남겨주세요.</li>}
          {comments.slice(0, 5).map((comment, index) => {
            const date = new Date(comment.createdAt);
            return (
              <li key={`${comment.createdAt}-${index}`} className="comment">
                <div className="comment-meta"><strong>익명의 코너맨</strong><span>{Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR')}</span></div>
                <p>{comment.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MatchDetail({ match }) {
  const { chosen, comments, vote, addComment } = useCommunity(match.id);
  return (
    <>
      <div className="match-stage">
        <Fighter fighter={match.fighters[0]} side="left" />
        <div className="match-center">
          <p className="eyebrow" id="match-weight">{match.weight}</p><span className="versus">VS</span><span className="bout-label">팬이 만드는 다음 이야기</span>
          <div className="match-stats" id="match-stats">
            {[['record', '전적'], ['height', '신장'], ['reach', '리치']].map(([key, label]) => <div key={key} className="stat-row"><span>{match.fighters[0][key]}</span><span>{label}</span><span>{match.fighters[1][key]}</span></div>)}
          </div>
        </div>
        <Fighter fighter={match.fighters[1]} side="right" />
      </div>
      <Prediction match={match} chosen={chosen} onVote={vote} />
      <CheerBoard comments={comments} onAddComment={addComment} />
    </>
  );
}

export default function FightCard() {
  const [matchId, setMatchId] = useState(matches[0].id);
  const match = matches.find(item => item.id === matchId);
  return (
    <section id="fight-card" className="section container">
      <SectionHeading eyebrow="01 / THE MATCHUP" note="당신의 선택, 당신의 챔피언.">FIGHT <em>CARD</em></SectionHeading>
      <div className="event-label"><span>BLACK COMBAT 17 : VANTABLACK</span><span>예시 대진 · 확정 정보 아님</span></div>
      <div className="match-tabs" role="group" aria-label="대진 선택">
        {matches.map(item => <button key={item.id} data-match={item.id} className={item.id === matchId ? 'active' : ''} aria-pressed={item.id === matchId} onClick={() => setMatchId(item.id)}>{item.label}</button>)}
      </div>
      <MatchDetail key={match.id} match={match} />
    </section>
  );
}
