// 모든 이름·대진·숫자는 레이아웃 확인용 예시입니다. 공식 데이터로 교체하세요.
export const site = {
    assets: {
        arena: '/images/bg/branding.webp',
        store: '',
        gym: '',
        partnerGym: ''
    },
    youtube: {
        apiKey: '',
        channelId: 'UC_IYjiKaQBPq-K1Iq4sM-UQ',
        channelUrl: 'https://www.youtube.com/channel/UC_IYjiKaQBPq-K1Iq4sM-UQ/videos',
        uploadsPlaylistId: 'UU_IYjiKaQBPq-K1Iq4sM-UQ'
    }
};

// 두 번째·세 번째 슬라이드는 전환 확인용 목업입니다. 실제 콘텐츠 준비 후 교체하세요.
export const heroSlides = [
    {
        id: 'vantablack',
        image: '/images/visual/vantablack.webp',
        alt: 'BLACK COMBAT XVII: VANTABLACK. 2026년 11월 21일, 고척 스카이돔.'
    },
    {
        id: 'mock-fight-night',
        mock: true,
        eyebrow: 'BLACK COMBAT · FIGHT NIGHT',
        title: ['THE NEXT', 'KING.'],
        description: '다음 왕좌의 주인공은 누구인가.',
        detail: '당신이 응원하는 선수에게 한 표를 보내세요.',
        href: '#fight-card',
        cta: '파이트 카드 보기',
        theme: 'gold'
    },
    {
        id: 'mock-inside',
        mock: true,
        eyebrow: 'BLACK COMBAT · INSIDE THE CAGE',
        title: ['BEYOND', 'THE FIGHT.'],
        description: '승부 뒤에 남겨진, 진짜 이야기.',
        detail: '케이지 안팎의 순간을 만나보세요.',
        href: '#media',
        cta: '미디어 살펴보기',
        theme: 'silver'
    }
];

export const matches = [
    {
        id: 'demo-feather',
        label: '01 · 페더급',
        weight: 'FEATHERWEIGHT · MAIN EVENT',
        fighters: [
            { id: 'demo-sirasoni', name: '시라소니', english: 'SIRASONI', rank: 'RED CORNER', record: '8 — 0', height: '180 cm', reach: '180 cm', image: '' },
            { id: 'demo-ares', name: '아레스', english: 'ARES', rank: 'BLUE CORNER', record: '12 — 3', height: '180 cm', reach: '183 cm', image: '' }
        ],
        votes: [124, 86]
    },
    {
        id: 'demo-light',
        label: '02 · 라이트급',
        weight: 'LIGHTWEIGHT · CO-MAIN EVENT',
        fighters: [
            { id: 'demo-light-red', name: '선수 C', english: 'FIGHTER C', rank: 'RED CORNER', record: '—', height: '—', reach: '—', image: '' },
            { id: 'demo-light-blue', name: '선수 D', english: 'FIGHTER D', rank: 'BLUE CORNER', record: '—', height: '—', reach: '—', image: '' }
        ],
        votes: [0, 0]
    },
    {
        id: 'demo-bantam',
        label: '03 · 밴텀급',
        weight: 'BANTAMWEIGHT · MAIN CARD',
        fighters: [
            { id: 'demo-bantam-red', name: '선수 E', english: 'FIGHTER E', rank: 'RED CORNER', record: '—', height: '—', reach: '—', image: '' },
            { id: 'demo-bantam-blue', name: '선수 F', english: 'FIGHTER F', rank: 'BLUE CORNER', record: '—', height: '—', reach: '—', image: '' }
        ],
        votes: [0, 0]
    }
];

// 첨부 디자인 기준의 표시 데이터입니다. 추후 랭킹 공급자 연결 시 이 구조로 매핑합니다.
export const champions = [
    { id: 'fly', weight: 'FLY', name: '우마왕', realName: '우성훈', image: '/images/champ/champ_fly.webp' },
    { id: 'bantam', weight: 'BANTAM', name: '투신', realName: '김재웅', image: '/images/champ/champ_bantam.webp' },
    { id: 'feather', weight: 'FEATHER', name: '시라소니', realName: '김재웅', image: '/images/champ/champ_feather.webp' },
    { id: 'light', weight: 'LIGHT', name: '버거있나', realName: '정한국', image: '/images/champ/champ_light.webp' },
    { id: 'welter', weight: 'WELTER', name: null, realName: null, image: '/images/champ/noname.webp' },
    // 제공 파일명은 heavy지만 첨부 디자인의 MIDDLE 카드 이미지로 사용합니다.
    { id: 'middle', weight: 'MIDDLE', name: '킹콩', realName: '오일학', image: '/images/champ/champ_heavy.webp' },
    { id: 'heavy', weight: 'HEAVY', name: null, realName: null, image: '/images/champ/noname.webp' },
    { id: 'underground', weight: 'UNDERGROUND', name: '검정', realName: '박평화', image: '/images/champ/champ_underground.webp' }
];
