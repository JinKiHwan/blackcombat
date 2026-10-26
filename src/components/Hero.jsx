import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { heroSlides } from '../data.js';
import CinematicSmoke from './effects/CinematicSmoke.jsx';
import 'swiper/css';
import './hero.css';

export default function Hero({ slides = heroSlides }) {
  if (!slides.length) return null;

  return (
    <section className="main-visual" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">블랙컴뱃 메인 비주얼</h1>
      <Swiper
        className="visual-swiper"
        modules={[Navigation, Pagination, Keyboard, A11y]}
        slidesPerView={1}
        speed={650}
        autoplay={false}
        rewind={slides.length > 1}
        watchOverflow={false}
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: false }}
        navigation={{ prevEl: '.visual-prev', nextEl: '.visual-next' }}
        pagination={{
          el: '.visual-pagination',
          clickable: true,
          renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="${index + 1}번 비주얼 보기"></button>`,
        }}
        a11y={{
          containerMessage: '블랙컴뱃 메인 비주얼',
          prevSlideMessage: '이전 비주얼',
          nextSlideMessage: '다음 비주얼',
          paginationBulletMessage: '{{index}}번 비주얼 보기',
          slideLabelMessage: '{{slidesLength}}개 중 {{index}}번째 비주얼',
        }}
      >
        {slides.map((slide, index) => {
          const Tag = slide.href ? 'a' : 'div';
          return (
            <SwiperSlide key={slide.id}>
              <Tag className={`visual-slide${slide.mock ? ` visual-mock visual-mock--${slide.theme}` : ''}`} {...(slide.href ? { href: slide.href } : {})}>
                {slide.mock ? (
                  <>
                    <span className="mock-watermark" aria-hidden="true">BC</span>
                    <div className="mock-content">
                      <span className="mock-badge">MOCKUP · 예시 콘텐츠</span>
                      <p className="eyebrow">{slide.eyebrow}</p>
                      <h2>{slide.title[0]}<br /><em>{slide.title[1]}</em></h2>
                      <p className="mock-description">{slide.description}</p>
                      <p className="mock-detail">{slide.detail}</p>
                      <span className="mock-cta">{slide.cta} <span aria-hidden="true">↗</span></span>
                    </div>
                  </>
                ) : (
                  <img className="visual-image" src={slide.image} alt={slide.alt} width="1920" height="880" fetchPriority={index === 0 ? 'high' : 'auto'} loading={index === 0 ? 'eager' : 'lazy'} draggable="false" />
                )}
              </Tag>
            </SwiperSlide>
          );
        })}
        <button className="visual-arrow visual-prev" slot="container-end" type="button" aria-label="이전 비주얼"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
        <button className="visual-arrow visual-next" slot="container-end" type="button" aria-label="다음 비주얼"><img src="/images/common/swiper-arrow.webp" alt="" /></button>
        <div className="visual-pagination" slot="container-end" />
      </Swiper>
      <CinematicSmoke />
    </section>
  );
}
