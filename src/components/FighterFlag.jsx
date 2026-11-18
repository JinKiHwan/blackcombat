const countryNames = {
  bh: '바레인', br: '브라질', eg: '이집트', jp: '일본', kg: '키르기스스탄',
  kr: '대한민국', kur: '쿠르디스탄', kz: '카자흐스탄', mn: '몽골', pe: '페루',
  ru: '러시아', tj: '타지키스탄', us: '미국', uz: '우즈베키스탄',
};

export const countryLabel = code => Object.hasOwn(countryNames, code) ? countryNames[code] : '';
export const flagPath = code => countryLabel(code) ? `/images/flags/${code}.svg` : null;

export default function FighterFlag({ code }) {
  const src = flagPath(code);
  const country = countryLabel(code);
  return src && <img className="fighter-flag" src={src} alt={country} title={country} width="18" height="13" />;
}
