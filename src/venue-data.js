// Keep event-source addresses intact for maps; normalize only venue presentation.
export const venueAssets = [
  { pattern: /고척|GOCHEOK/i, name: 'GOCHEOK SKY DOME', image: '/images/numbering/gocheck.png' },
  { pattern: /인스파이어|INSPIRE/i, name: 'INSPIRE ARENA', image: '/images/venues/inspire-arena.png' },
  { pattern: /화정|HWAJEONG/i, name: 'HWAJEONG GYMNASIUM', image: '/images/venues/hwajeong-gymnasium.png' },
  { pattern: /벡스코|BEXCO/i, name: 'BEXCO', image: '/images/venues/bexco.png' },
  { pattern: /킨텍스|KINTEX/i, name: 'KINTEX', image: '/images/venues/kintex.jpg' },
  { pattern: /남동체육관|NAMDONG/i, name: 'NAMDONG GYMNASIUM', image: '/images/venues/namdong.jpg' },
  { pattern: /고라쿠엔|KORAKUEN/i, name: 'KORAKUEN HALL', image: '/images/venues/korakuen.jpg' },
  { pattern: /크로마|CHROMA/i, name: 'CHROMA', image: '/images/venues/chroma.jpg' },
  { pattern: /파라다이스시티|PARADISE CITY/i, name: 'PARADISE CITY', image: '/images/venues/paradise-city.jpg' },
  { pattern: /수원.*컨벤션|SUWON.*CONVENTION/i, name: 'SUWON CONVENTION CENTER', image: '/images/venues/suwon-convention-center.jpg' },
  { pattern: /코엑스|COEX/i, name: 'COEX', image: '/images/venues/coex.jpg' },
  { pattern: /부천체육관|BUCHEON GYMNASIUM/i, name: 'BUCHEON GYMNASIUM', image: '/images/venues/bucheon.jpg' },
  { pattern: /학생체육관|JAMSIL.*STUDENT/i, name: 'JAMSIL STUDENTS GYMNASIUM', image: '/images/venues/jamsil-student.jpg' },
  { pattern: /블랙\s*아고라|BLACK AGORA/i, name: 'BLACK AGORA', image: '/images/venues/black-agora.jpg' },
  { pattern: /오피셜짐|OFFICIAL GYM/i, name: 'BLACK COMBAT OFFICIAL GYM', image: '/images/venues/official-gym.jpg' },
  { pattern: /마린\s*멧세|MARINE MESSE/i, name: 'MARINE MESSE FUKUOKA', image: '/images/venues/marine-messe.jpg' },
];
export function findVenueAsset(venue = '') {
  return venueAssets.find(asset => asset.pattern.test(venue));
}
