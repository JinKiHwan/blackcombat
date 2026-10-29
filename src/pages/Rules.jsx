import { useEffect, useRef, useState } from 'react';
import { rulebooks } from '../data/rules.js';
import './rules.css';

export default function Rules() {
  const [language, setLanguage] = useState('ko');
  const [type, setType] = useState('pro');
  const tabs = useRef([]);
  const book = rulebooks[type];
  const english = language === 'en';
  useEffect(() => {
    const previous = document.title;
    document.title = 'RULES | BLACK COMBAT';
    return () => { document.title = previous; };
  }, []);
  function changeTab(event, index) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    setLanguage(next ? 'en' : 'ko');
    tabs.current[next]?.focus();
  }
  return <section className="rules-page" aria-labelledby="rules-title">
    <div className="rules-container">
      <header className="rules-heading"><p>BLACK COMBAT · THE RULEBOOK</p><h1 id="rules-title" className="section-title">RULES</h1><div><span className="rules-edition">OFFICIAL RULES GUIDE</span></div></header>
      <div className="rules-controls">
        <div className="rules-format" role="group" aria-label="규정 종류"><button type="button" aria-pressed={type === 'pro'} onClick={() => setType('pro')}>PRO RULES</button><button type="button" aria-pressed={type === 'amateur'} onClick={() => setType('amateur')}>AMATEUR RULES</button></div>
        <div className="rules-languages" role="tablist" aria-label="규정 언어">{[['ko', '한국어'], ['en', 'ENGLISH']].map(([key, label], index) => <button key={key} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`rules-tab-${key}`} aria-controls={`rules-panel-${key}`} aria-selected={language === key} tabIndex={language === key ? 0 : -1} onClick={() => setLanguage(key)} onKeyDown={event => changeTab(event, index)}>{label}</button>)}</div>
      </div>
      <div className="rules-panel" role="tabpanel" id={`rules-panel-${language}`} aria-labelledby={`rules-tab-${language}`} lang={language} key={`${type}-${language}`}>
        <aside className="rules-index" aria-label={english ? 'Contents' : '목차'}><p>{english ? 'CONTENTS' : '규정 목차'}</p><nav>{book.sections.map((section, index) => <a key={section.id} href={`#rule-${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section[language][0]}</a>)}</nav><a className="rules-original" href={book.source} target="_blank" rel="noopener noreferrer">{english ? 'Full official rulebook' : '공식 규정 전체보기'} ↗</a></aside>
        <div className="rules-document">
          <div className="rules-document-heading"><p>{type === 'pro' ? 'PROFESSIONAL' : 'BLACK COMBAT BEGINS'}</p><h2>{english ? (type === 'pro' ? 'Professional competition rules' : 'Amateur competition rules') : (type === 'pro' ? '프로 경기 규정' : '아마추어 경기 규정')}</h2><div><span>{english ? 'Summary guide · Full provisions in the official rulebook.' : '핵심 규정 요약 · 세부 조건과 전체 조항은 공식 원문을 확인하세요.'}</span>{book.updated && <time dateTime="2026-07-22">{english ? 'Effective' : '기준일'} {book.updated}</time>}</div></div>
          {book.sections.map((section, index) => <section className="rules-article" id={`rule-${section.id}`} key={section.id} aria-labelledby={`rule-heading-${section.id}`}><header><span>{String(index + 1).padStart(2, '0')}</span><h3 id={`rule-heading-${section.id}`}>{section[language][0]}</h3></header><p>{section[language][1]}</p>{section.id === 'divisions' && <div className="rules-table-wrap"><table><caption className="sr-only">{english ? 'Weight division limits in kilograms' : '체급별 체중 기준, kg'}</caption><thead><tr><th scope="col">{english ? 'DIVISION' : '체급'}</th><th scope="col">{english ? 'WEIGHT (kg)' : '체중 (kg)'}</th></tr></thead><tbody>{book.weights.map(row => <tr key={row[0]}><th scope="row">{row[english ? 1 : 0]}</th><td>{row[2]}</td></tr>)}</tbody></table></div>}</section>)}
          <footer className="rules-source"><span>BLACK COMBAT · RULES</span><p>{english ? 'This guide is a summary, not the full rulebook. Consult the official source for exceptions, penalties and amendments. English summaries are translated for this page.' : '이 페이지는 원문을 요약한 안내입니다. 예외·제재·개정 사항은 공식 규정을 확인해주세요. 영문 요약은 이 페이지를 위해 번역했습니다.'}</p><a href={book.source} target="_blank" rel="noopener noreferrer">{english ? 'Read the official source' : '공식 원문 확인하기'} ↗</a></footer>
        </div>
      </div>
    </div>
  </section>;
}
