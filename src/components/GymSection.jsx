import { useRef, useState } from 'react';
import { A11y, EffectCreative, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { gyms } from '../gym-data.js';
import 'swiper/css';
import 'swiper/css/effect-creative';
import './gym.css';

function GymGallery({ gym }) {
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);
  const count = gym.images.length;
  const pages = Array.from({ length: count }, (_, index) => index);

  return (
    <div id={`gym-panel-${gym.id}`} className="gym-gallery" role="tabpanel" aria-labelledby={`gym-tab-${gym.id}`}>
      <div className="gym-social" aria-label={`${gym.label} 외부 링크`}>
        <a href={gym.map} target="_blank" rel="noopener noreferrer" aria-label={`${gym.label} 카카오맵 열기 · 새 탭`}><img src="/images/common/kakaomap.webp" alt="" width="48" height="48" draggable="false" /></a>
        <a href={gym.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${gym.label} 인스타그램 · 새 탭`}><img src="/images/common/instagram.webp" alt="" width="48" height="48" draggable="false" /></a>
      </div>
      <div className="gym-stage">
        <Swiper
          className="gym-swiper"
          modules={[A11y, EffectCreative, Keyboard]}
          slidesPerView={1}
          spaceBetween={0}
          effect="creative"
          creativeEffect={{
            perspective: false,
            limitProgress: 1,
            prev: { translate: ['-28%', 0, 0], scale: 0.8, opacity: 0.2 },
            next: { translate: ['28%', 0, 0], scale: 0.8, opacity: 0.2 },
          }}
          speed={600}
          autoplay={false}
          loop={false}
          rewind={false}
          slideToClickedSlide
          keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: false }}
          onSwiper={swiper => { swiperRef.current = swiper; }}
          onSlideChange={swiper => setActive(swiper.activeIndex)}
          a11y={{ containerMessage: gym.label, slideLabelMessage: '{{slidesLength}}장 중 {{index}}번째 사진' }}
        >
          {gym.images.map((image, index) => (
            <SwiperSlide key={image}>
              <img src={image} alt={`${gym.label} 시설 사진 ${index + 1}`} width="1600" height="900" loading={index === 0 ? 'eager' : 'lazy'} draggable="false" />
            </SwiperSlide>
          ))}
        </Swiper>
        {count > 1 && <>
          <button className="gym-nav gym-prev" type="button" aria-label="이전 체육관 사진" disabled={active === 0} onClick={() => swiperRef.current?.slidePrev()}><img src="/images/common/swiper-arrow.webp" alt="" /></button>
          <button className="gym-nav gym-next" type="button" aria-label="다음 체육관 사진" disabled={active === count - 1} onClick={() => swiperRef.current?.slideNext()}><img src="/images/common/swiper-arrow.webp" alt="" /></button>
        </>}
      </div>
      <div className="visual-pagination gym-pagination" role="group" aria-label="체육관 사진 선택">
        {pages.map(index => <button key={index} type="button" className={`swiper-pagination-bullet${index === active ? ' swiper-pagination-bullet-active' : ''}`} aria-label={`${index + 1}번 사진 보기`} aria-current={index === active ? 'true' : undefined} onClick={() => swiperRef.current?.slideTo(index)} />)}
      </div>
      <p className="sr-only" role="status">{gym.label} {active + 1} / {count}</p>
    </div>
  );
}

export default function GymSection() {
  const [selected, setSelected] = useState('official');
  const tabRefs = useRef([]);
  const gym = gyms.find(item => item.id === selected);

  function handleTabKey(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % gyms.length;
    else if (event.key === 'ArrowLeft') next = (index + gyms.length - 1) % gyms.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = gyms.length - 1;
    else return;
    event.preventDefault();
    setSelected(gyms[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="gym" className="gym-section" aria-labelledby="gym-heading">
      <div className="gym-heading"><h2 id="gym-heading" className="section-title">GYM</h2></div>
      <div className="gym-location-tabs" role="tablist" aria-label="체육관 선택">
        {gyms.map((item, index) => <button key={item.id} ref={el => { tabRefs.current[index] = el; }} id={`gym-tab-${item.id}`} type="button" role="tab" aria-selected={selected === item.id} aria-controls={selected === item.id ? `gym-panel-${item.id}` : undefined} tabIndex={selected === item.id ? 0 : -1} onClick={() => setSelected(item.id)} onKeyDown={event => handleTabKey(event, index)}>{item.label}</button>)}
      </div>
      <GymGallery key={selected} gym={gym} />
    </section>
  );
}
