import Rules from './pages/Rules.jsx';
import Doping from './pages/Doping.jsx';
import { usePageTransition } from './hooks/usePageTransition.js';
import Numbering from './pages/Numbering.jsx';
import Ranking from './pages/Ranking.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import RisingEmbers from './components/effects/RisingEmbers.jsx';
import Header from './components/Header.jsx';
import MediaSection from './components/MediaSection.jsx';
import GymSection from './components/GymSection.jsx';
import Hero from './components/Hero.jsx';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import Champions from './components/Champions.jsx';
import StoreSection from './components/StoreSection.jsx';
import { Footer, Manifesto, Partners } from './components/BrandSections.jsx';

export default function App() {
  useSmoothScroll();
  usePageTransition();
  const path = window.location.pathname;
  const numbering = path.match(/^\/numbering\/(\d+)\/?$/);
  const eventDetail = path.match(/^\/events\/(\d+)\/?$/);
  const home = path === '/' || path === '/index' || path === '/index.html';
  return (
    <>
      <a className="skip-link" href="#main">본문으로 이동</a>
      <Header />
      <main id="main">
        {/^\/doping\/?$/.test(path) ? <Doping /> : /^\/rules\/?$/.test(path) ? <Rules /> : /^\/events\/?$/.test(path) ? <Events /> : eventDetail ? <EventDetail id={eventDetail[1]} /> : /^\/ranking\/?$/.test(path) ? <Ranking /> : numbering ? <Numbering id={Number(numbering[1])} /> : home ? <>
        <Hero />
        <Manifesto />
        <Champions />
        <MediaSection />
        <StoreSection />
        <GymSection />
        </> : <section className="numbering-not-found"><h1>페이지를 찾을 수 없습니다.</h1><a href="/">홈으로</a></section>}
        <Partners />
      </main>
      <Footer />
      {['/', '/index.html'].includes(window.location.pathname) && <RisingEmbers />}
    </>
  );
}
