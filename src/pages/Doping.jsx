import { useEffect, useRef, useState } from 'react';
import { dopingSource, dopingSections, dopingTests, dopingCases } from '../data/doping.js';
import './rules.css';
import './doping.css';

export default function Doping() {
  const [language, setLanguage] = useState('ko');
  const [view, setView] = useState('info');
  const languageTabs = useRef([]);
  const english = language === 'en';
  const views = [['info', '정보', 'INFORMATION'], ['tests', '검사이력', 'TEST HISTORY'], ['cases', '양성명단', 'POSITIVE CASES']];
  const title = views.find(row => row[0] === view)[english ? 2 : 1];
  useEffect(() => {
    const previous = document.title;
    document.title = 'DOPING | BLACK COMBAT';
    return () => { document.title = previous; };
  }, []);
  function changeLanguage(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    setLanguage(next ? 'en' : 'ko');
    languageTabs.current[next]?.focus();
  }
  const source = `${dopingSource}${view === 'info' ? '' : `?tab=${view === 'tests' ? 2 : 3}`}`;
  return <section className="rules-page doping-page" aria-labelledby="doping-title"><div className="rules-container">
    <header className="rules-heading"><p>BLACK COMBAT · FAIR PLAY</p><h1 id="doping-title" className="section-title">DOPING</h1><div><span className="rules-edition">ANTI-DOPING GUIDE</span></div></header>
    <div className="rules-controls"><div className="rules-format" role="group" aria-label={english ? 'Doping category' : '도핑 안내 종류'}>{views.map(([key, ko, en]) => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>{english ? en : ko}</button>)}</div><div className="rules-languages" role="tablist" aria-label="Language">{[['ko', '한국어'], ['en', 'ENGLISH']].map(([key, label], index) => <button key={key} ref={node => { languageTabs.current[index] = node; }} role="tab" type="button" id={`doping-tab-${key}`} aria-controls={`doping-panel-${key}`} aria-selected={language === key} tabIndex={language === key ? 0 : -1} onClick={() => setLanguage(key)} onKeyDown={event => changeLanguage(event, index)}>{label}</button>)}</div></div>
    <div className={`rules-panel doping-panel ${view !== 'info' ? 'doping-records-panel' : ''}`} role="tabpanel" id={`doping-panel-${language}`} aria-labelledby={`doping-tab-${language}`} lang={language} key={`${view}-${language}`}>
      {view === 'info' && <aside className="rules-index"><p>{english ? 'CONTENTS' : '도핑 안내 목차'}</p><nav>{dopingSections.map((section, index) => <a key={section.id} href={`#doping-${section.id}`}><span>0{index + 1}</span>{section[language][0]}</a>)}</nav><a className="rules-original" href={source} target="_blank" rel="noopener noreferrer">{english ? 'Official provisions' : '공식 규정 전체보기'} ↗</a></aside>}
      <div className="rules-document"><div className="rules-document-heading"><p>BLACK COMBAT · ANTI-DOPING</p><h2>{title}</h2><div><span>{english ? 'Official source checked · English translated for this guide' : '공식 사이트 기준 · 영문은 이 페이지를 위한 번역입니다'}</span><time dateTime="2026-10-28">{english ? 'Checked' : '확인일'} 2026.10.28</time></div></div>
        {view === 'info' ? dopingSections.map((section, index) => <section className="rules-article" id={`doping-${section.id}`} key={section.id}><header><span>0{index + 1}</span><h3>{section[language][0]}</h3></header><p>{section[language][1]}</p></section>) : <div className="rules-table-wrap doping-records" role="region" aria-label={title} tabIndex={0}><table><caption className="sr-only">{title}</caption><thead><tr>{(view === 'tests' ? (english ? ['EVENT', 'TESTING', 'RESULT', 'RECORDED'] : ['대회명', '검사내용', '결과', '기록날짜']) : (english ? ['NAME', 'EVENT', 'ARTICLE', 'SUBSTANCE', 'ACTION', 'PERIOD / DATE'] : ['성명', '대회명', '위반 규정', '금지 성분', '처리 결과', '기간 / 날짜'])).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{view === 'tests' ? dopingTests.map(row => <tr key={row[1]}><th scope="row">{row[english ? 1 : 0]}</th><td>{english ? `Unannounced · ${row[2] ?? 'all'} athletes${row[1] === 'C.L week 15' ? ' (main card)' : ''}` : `${row[1] === 'C.L week 15' ? '메인카드 ' : ''}${row[2] ? `${row[2]}명` : '전원'} 불시검사`}</td><td>{row[3] === 'all' ? (english ? 'All negative' : '전원 음성') : (english ? `${row[3]} negative` : `${row[3]}명 음성`)}</td><td>{row[4]}</td></tr>) : dopingCases.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[english ? 2 : 1]}</td><td>{row[3]}</td><td>{row[english ? 5 : 4]}</td><td>{row[english ? 7 : 6]}</td><td>{row[8]}</td></tr>)}</tbody></table></div>}
        <footer className="rules-source"><span>BLACK COMBAT · CLEAN SPORT</span><p>{english ? 'Information is summarized; consult the official provisions for details. Records retain published masked names and dates; listed periods do not imply a current suspension.' : '정보는 핵심 내용을 요약했습니다. 세부 조건은 공식 원문을 확인해주세요. 기록의 익명 표기와 날짜를 유지했으며, 기재된 제재 기간은 현재 자격정지 여부를 뜻하지 않습니다.'}</p><a href={source} target="_blank" rel="noopener noreferrer">{english ? 'View official source' : '공식 원문 확인하기'} ↗</a></footer>
      </div>
    </div>
  </div></section>;
}
