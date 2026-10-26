import { site } from '../data.js';
import { Asset, SectionHeading, Wordmark } from './shared.jsx';

export function Ticker() {
  return <div className="ticker" aria-hidden="true"><span>WHO IS THE KING?</span><i>✦</i><span>BLACK COMBAT</span><i>✦</i><span>BEYOND THE FIGHT</span><i>✦</i><span>WHO IS THE KING?</span><i>✦</i></div>;
}

export function Manifesto() {
  return (
    <section id="branding" className="branding-section" aria-labelledby="branding-title">
      <Asset image={site.assets.arena} aria-hidden="true" />
      <div className="container branding-content">
        <h2 id="branding-title" className="section-title">Who is the King?</h2>
        <p className="branding-subtitle">아시아를 넘어, 세계의 왕좌를 향해</p>
        <p className="branding-description">
          <span>승패를 넘어, 파이터의 인생이 맞붙는 무대.</span>
          <span>블랙컴뱃은 선수 개개인의 이야기에 스포트라이트를 비추고,</span>
          <span>그들의 도전과 열정을 통해 격투기의 새로운 시대를 열어갑니다.</span>
        </p>
      </div>
    </section>
  );
}

export function Store() {
  return (
    <section className="store">
      <Asset image={site.assets.store} aria-hidden="true" />
      <div className="container store-inner"><div><p className="eyebrow">WEAR YOUR SPIRIT</p><h2 className="section-title">BLACK COMBAT<br /><em>STORE.</em></h2><p>케이지 밖에서도, 블랙컴뱃.</p></div><span className="button outline">스토어 링크 준비 중 ↗</span></div>
    </section>
  );
}

export function Partners() {
  return <div className="partners container"><span>OUR PARTNERS</span><p>파트너 로고 영역</p><p>PARTNER 01</p><p>PARTNER 02</p><p>PARTNER 03</p></div>;
}

export function Footer() {
  return (
    <footer className="container footer"><Wordmark /><p>블랙컴뱃 브랜딩 페이지 · 프로토타입<br />이미지 및 공식 정보는 추후 업데이트됩니다.</p><span>© 2026 BLACK COMBAT CONCEPT</span><a href="#">BACK TO TOP ↑</a></footer>
  );
}
