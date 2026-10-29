import { findVenueAsset } from '../venue-data.js';
import './event-venue.css';

export default function EventVenue({ venue, image, poster }) {
  if (!venue) return null;
  const venueAsset = findVenueAsset(venue);
  const displayName = venueAsset?.name || venue;
  const venueImage = venueAsset?.image || image;
  const query = /GOCHEOK/i.test(venue) ? '서울 고척스카이돔' : venue;
  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
  return <section className="numbering-venue" aria-labelledby="venue-title">
    <h2 id="venue-title">{displayName}</h2>
    <a className="event-venue-trigger" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${venue} 카카오맵 위치 보기 · 새 탭`}>
      {venueImage ? <img className="numbering-venue-image" src={venueImage} alt={`${displayName} 경기장 분위기 재구성 이미지`} loading="lazy" /> : <span className="event-venue-card" style={{ '--venue-poster': `url("${poster || ''}")` }}><span>VENUE</span><strong>{displayName}</strong></span>}
      <span className="event-venue-cta"><img src="/images/common/kakaomap.webp" alt="" />카카오맵에서 위치 보기 ↗</span>
    </a>
  </section>;
}
