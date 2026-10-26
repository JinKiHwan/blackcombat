import { site } from '../data.js';
import { Asset } from './shared.jsx';
import { Autoplay, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './footer.css';

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

const sponsors = [
  ['sponsors_lg.png', 'LG'],
  ['sponsor_doctorzon.png', '닥터존'],
  ['sponsor_pg.png', 'Pocket Games Soft'],
  ['sponsors_bysec.png', 'BYSEC'],
  ['sponsor_img_3.png', 'ZEBRA'],
  ['sponsor_downton.png', 'DOWNTON THE BLACK'],
  ['sponsor_musinsa.png', 'MUSINSA'],
  ['sponsors_iyagi.png', 'IYAGI'],
  ['sponsor_borntowin.png', 'BORN TO WIN'],
  ['sponsor_bf.png', 'BF'],
  ['sponsors_inbody.png', 'InBody'],
  ['sponsor_ojida.png', '오지다'],
  ['sponsor_daeati.png', '대아티아이'],
];

export function Partners() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <section className="sponsor-strip" aria-label="블랙컴뱃 스폰서">
      <Swiper
        modules={[Autoplay, A11y]}
        slidesPerView="auto"
        slidesPerGroup={1}
        speed={1400}
        loop
        autoplay={reducedMotion ? false : { delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        a11y={{ containerMessage: '블랙컴뱃 스폰서', slideLabelMessage: '{{slidesLength}}개 중 {{index}}번째 스폰서' }}
      >
        {sponsors.map(([file, name]) => (
          <SwiperSlide key={file} className={`sponsor-logo${file === 'sponsor_downton.png' ? ' sponsor-logo--wide' : ''}`}>
            <img src={`/images/sponsor/${file}`} alt={name} loading="lazy" draggable="false" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer site-footer">
      <p>
        회사명 : 주식회사 이데아 파라곤<br />
        주소 : 서울시 성동구 서울숲2길 35<br />
        사업자 등록번호 : 682-81-02925<br />
        대표 : 박평화<br />
        전화 : <a href="tel:07052229146">070-5222-9146</a><br />
        통신판매업신고번호 : 2025-서울성동-1110<br />
        개인정보 보호책임자 : 박영광 (<a href="mailto:ideaparagon.official@gmail.com">ideaparagon.official@gmail.com</a>)<br />
        Blackcombat © 2026. All Rights Reserved.
      </p>
    </footer>
  );
}
