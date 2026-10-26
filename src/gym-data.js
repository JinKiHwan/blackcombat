// 폴더 파일명 순서에 맞춰 사진을 연결합니다. 이미지 추가 시 해당 목록을 갱신하세요.
export const gyms = [
  {
    id: 'official',
    label: 'Official Gym',
    instagram: 'https://www.instagram.com/blackcombat_songnae/',
    map: 'https://place.map.kakao.com/1040896238',
    images: Array.from({ length: 14 }, (_, index) => `/images/gym/official_${String(index + 1).padStart(2, '0')}.webp`),
  },
  {
    id: 'daejeon',
    label: 'Daejeon Gym',
    instagram: 'https://www.instagram.com/blackcombat_daejeon/',
    map: 'https://place.map.kakao.com/351681335',
    images: ['/images/gym/daejeon.webp'],
  },
];
