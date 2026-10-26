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
  return (
    <>
      <a className="skip-link" href="#main">본문으로 이동</a>
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <Champions />
        <MediaSection />
        <StoreSection />
        <GymSection />
        <Partners />
      </main>
      <Footer />
      {['/', '/index.html'].includes(window.location.pathname) && <RisingEmbers />}
    </>
  );
}
