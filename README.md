# BLACK COMBAT · Branding Skeleton

첨부 레이아웃을 바탕으로 만든 검정·골드 반응형 브랜딩 페이지입니다. React + Vite + CSS로 구성하며 사용자가 제공한 메인 비주얼·로고·슬라이더 리소스를 연결했습니다.

## 실행

```sh
npm install
npm run dev
```

`npm run build`로 정적 배포용 `dist/`를 생성하고 `npm run preview`로 확인합니다.

## React 구조

- `src/main.jsx`: React 진입점, StrictMode, CSS 로딩
- `src/App.jsx`: 전체 페이지 섹션 조합
- `src/components/Header.jsx`: 모바일 메뉴
- `src/components/Hero.jsx`, `hero.css`: 수동 Swiper, 이미지 화살표·페이지네이션
- `src/components/effects/CinematicSmoke.jsx`, `smokeShaders.js`: 사용자 제공 WebGL 스모그 효과
- `src/hooks/useSmoothScroll.js`: Lenis 스크롤 및 정리
- `src/components/FightCard.jsx`: 대진·선수·응원 비율·댓글
- `src/components/BrandSections.jsx`: 브랜드 소개·파트너·푸터
- `src/components/StoreSection.jsx`, `store.css`: 배경 영상 스토어 배너
- `src/components/MediaSection.jsx`: 유튜브 조회 및 로딩·빈 결과·오류 처리, 언마운트 시 요청 취소
- `src/components/GymSection.jsx`: 체육관 탭
- `src/components/shared.jsx`: 공통 이미지 영역·섹션 제목·워드마크
- `src/hooks/useCommunity.js`: 응원·댓글 상태와 저장소 연결, 다른 탭 변경 동기화
- `src/data.js`, `src/store.js`, `src/youtube.js`: 콘텐츠·저장·외부 API 계층

기존 `blackcombat-demo-v1` 저장 키와 대진 ID를 유지하므로 이전에 저장한 응원·댓글도 읽습니다. 대진 전환 시 상세 컴포넌트를 대진 ID로 재생성해 입력 중인 댓글·안내 문구를 초기화합니다.

## 현재 구현

- 히어로 → 브랜드 소개 → CHAMP → MEDIA & LEGACY → 스토어 → GYM → 티커 → 파이트 카드 → 파트너/푸터
- 모바일 메뉴, 대진 선택, 체육관 탭
- 대진별 응원 선택 및 변경, 응원 비율 표시, 익명 댓글 등록
- localStorage 데모: 새로고침 후 유지, 대진별 분리, 최근 댓글 5개 표시 / 최대 50개 저장
- 데이터가 없는 대진은 비율 `—` 표시. 실제 경기 승률과 팬 예측을 구분
- 유튜브 업로드 재생목록 조회 모듈 및 미연결/오류 시 대체 화면

**현재는 Firebase 미연결입니다. 방문자 전체 집계, 인증, 댓글 관리, 실시간 동기화는 구현되지 않았습니다.** 예시 대진/전적/응원 수는 공식 정보가 아닙니다. 데모의 중복 응원 제한은 브라우저 저장 상태 기준이며 부정 투표 방지 기능이 아닙니다.

## 이미지와 콘텐츠 넣기

1. `public/images/`에 직접 준비한 이미지를 넣습니다.
2. `src/data.js`의 `heroSlides`에 메인 비주얼을 추가하고, `site.assets`에 브랜드 소개·스토어·체육관 이미지 경로를 지정합니다.
3. 선수는 `matches[].fighters[].image`, 챔피언은 `champions[].image`에 경로를 지정합니다. 미디어 썸네일은 공식 채널 영상에서 자동으로 연결합니다.
4. 동일 파일에서 대진·선수명·전적·챔피언 이름을 교체합니다. 실제 서비스 전 `demo-` ID와 예시 응원 수도 교체해야 합니다.
5. 스토어 링크·영상은 `src/components/StoreSection.jsx`, 파트너·사업자 정보는 `BrandSections.jsx`, 체육관 주소는 `GymSection.jsx`에서 교체합니다.

## 스토어

- 미디어 다음에 전체 너비 배경 영상 배너를 표시합니다. 원본 영상은 `https://player-api.charlla.io/mp4/lx8mgdfzm83`를 직접 스트리밍합니다.
- 음소거·자동재생·반복·모바일 인라인 재생. 화면 밖/비활성 탭/모션 감소 설정에서는 정지합니다. 자동재생이 차단되면 수동 재생 버튼을 표시합니다.
- 중앙 공통 타이틀과 골드 버튼을 배치하며 `https://blackcombatstore.com/`으로 새 탭에서 즉시 이동합니다. 버튼은 초기 크기의 80%(데스크톱 최소 224×64px)입니다.
- 실제 원격 영상의 재생 시간 증가, muted/loop/playsInline, 버튼 이동, 데스크톱·모바일 화면과 빌드를 확인했습니다.

## GYM

- `src/gym-data.js`: Official Gym은 `official_01.webp`~`official_14.webp`, Daejeon Gym은 `daejeon.webp`를 연결합니다.
- `GymSection.jsx`, `gym.css`: 탭 전환, 중앙 사진과 어두운 다음 사진 미리보기, 수동 Swiper·화살표·사진 개수만큼 페이지네이션(간격 2px). 자동재생·루프·되감기 없음. 다음 사진이 활성 사진 뒤에 겹칩니다.
- 탭 전환 시 첫 사진으로 초기화하고, 대전처럼 1장만 있으면 화살표를 표시하지 않습니다. 키보드 좌우/Home/End로 탭을 전환할 수 있습니다.
- 탭 글꼴은 Noto Serif Regular 20px입니다. 사진 우하단의 카카오맵·인스타그램은 탭별 설정을 새 탭으로 엽니다. 카카오맵은 사용자가 제공한 동일 URL을 두 지점에 적용했습니다.
- 오피셜 14장/대전 1장, 슬라이드·페이지네이션·탭 초기화·키보드 전환·모바일 가로 넘침 없음과 빌드를 검증했습니다.

권장 이미지: 히어로 가로형 1920px 이상, 선수·챔피언 투명 배경 세로형 PNG/WebP, 미디어 16:9, 체육관 가로형. 이미지를 비워두면 CSS 자리 표시자가 표시됩니다.

## 브랜딩 섹션 / 폰트

- 메인 비주얼 바로 다음 `#branding`에 `branding.webp` 배경을 연결하고 텍스트를 가운데 정렬합니다.
- 제목: 공통 `.section-title` 클래스(`src/components/titles.css`), Abril Fatface Regular 65px, 자간 0, 골드 `#EAB00B`와 이미지 채우기 46% 질감(기존 40%에서 15% 증가). 디센더 잘림 방지 여백 포함.
- 부제: Pretendard Bold 24px, 흰색, 자간 0.
- 본문: Pretendard Light 18px, 흰색, 행간 130%, 자간 0.
- 모바일은 제목 34~48px, 부제 18px, 본문 14px로 조정합니다.
- `src/fonts.css`에서 Abril Fatface와 Pretendard를 로컬 로딩하며, 영문 디스플레이·본문 기본 폰트에도 사용합니다. `public/fonts`에 공식 배포 글꼴 및 라이선스를 보관하여 외부 폰트 CDN에 의존하지 않습니다.
- 브랜딩 레이아웃과 텍스트 설정은 `src/components/branding.css`, 문구는 `BrandSections.jsx`에서 수정합니다.
- 브랜딩 배경 opacity 0.5, 부제 위 여백 88px, 본문 위 여백 47px. 섹션 높이는 825px, 배경 크기는 auto 100%를 유지합니다.

## CHAMP

- `src/components/Champions.jsx`와 `champions.css`에서 4열 × 2행(모바일 2열) 카드를 구성합니다.
- 이미지와 이름은 `src/data.js`의 `champions` 배열에서 관리합니다. 현재는 첨부 디자인 기준이며 실제 랭킹 API가 연결된 상태는 아닙니다.
- `public/images/champ/champ_heavy.webp`는 첨부 디자인의 MIDDLE 선수 이미지로 사용합니다. WELTER·HEAVY는 `noname.webp`를 사용합니다.
- 챔피언이 있는 카드만 호버·키보드 포커스 효과를 제공합니다. 공석은 체급 색상 전환·홀로그램·포인터 이벤트·탭 포커스를 제외합니다.
- `HoloFoil.jsx`: 전달받은 HoloCard 예시의 glitter 방향을 참고한 독립 구현. 그런지 금박·황동·샴페인 컬러, intensity 0.85 / edgeSparkle 0.8 / frame 4 / glare 0.5. 원본 컴포넌트 소스는 제공되지 않았으므로 같은 렌더러의 복제는 아닙니다.
- 카드 회전·3D·확대 없이 포인터 위치로 광원·금박 패턴만 이동합니다. 모션 감소 설정에서는 홀로그램을 끕니다. 랭킹보기는 준비 안내를 펼칩니다.
- 카드 하단은 둥근 검정 그라디언트이며, 이름은 Song Myung(링네임 32px / 본명 18px)을 사용합니다.
- 전체 페이지 그런지 농도는 16%에서 18.4%로 약 15% 높였습니다.

## 메인 비주얼 / 스크롤

- `heroSlides`에 `id`, `image`, `alt`, 선택적 `href`를 등록합니다. 현재는 `/images/visual/vantablack.webp` 원본 1장과 텍스트 목업 2장으로 총 3장입니다. 목업은 `mock: true`, 제목·설명·링크로 구성하며 화면에 예시 콘텐츠임을 표시합니다.
- Swiper 자동재생 없음. 1장일 때 화살표 비활성화, 여러 장일 때 화살표·키보드·스와이프·페이지네이션으로 전환합니다.
- 원본 1920×880 비율을 유지하여 모바일에서도 이미지 내 문구를 자르지 않습니다. 모바일 전용 세로형 이미지가 필요하면 추후 별도 소스를 추가합니다.
- 페이지네이션은 `swiper-pagination.webp`를 22×26px로 표시(모바일 14×17px), 클릭 영역은 44×44px입니다. 비활성은 이미지 농도 30% + CSS 광도 블렌딩 + SVG 노이즈 텍스처 필터입니다. grayscale은 격리된 합성 레이어에서도 무채색이 유지되도록 사용합니다. 텍스처의 입자 크기·강도는 첨부 화면에 세부 값이 없어 근사했으며, 활성 아이콘은 원본 이미지를 표시합니다.
- 화살표는 `swiper-arrow.webp`를 사용하고 왼쪽만 180도 회전합니다.
- 스모그는 이미지 위의 독립 캔버스이며 `pointer-events: none`입니다. 마우스·터치 반응 로직과 좌표 리스너를 제거하여 슬라이드 링크·드래그를 방해하지 않습니다.
- 메인 섹션은 overflow visible, Swiper 내부는 overflow hidden으로 분리합니다. 연기 캔버스를 아래로 100~220px 확장하고 마스크로 페이드아웃하여 다음 섹션 위까지 자연스럽게 이어집니다.
- 기본 배경은 검정입니다. `body::before`를 문서 전체 높이에 배치하고 `grunge.webp`를 1440px 폭으로 `background-repeat: repeat`하여 적용합니다. `invert(1)` + `screen` 합성, 농도 16%로 콘텐츠 아래 배경에 질감을 표시하며 `pointer-events: none`으로 클릭을 통과시킵니다.
- 옵션: 수평 속도 0.15, 수직 기류 -0.05, 농도 0.58, 소용돌이 1.30, 결 0.10, 하단 마스크 1.00. 색은 첨부 코드 기본값을 사용합니다.
- 셰이더는 첨부 FBM/Domain Warping 코드를 사용합니다. 역순 `smoothstep`은 같은 방향의 마스크를 만드는 `1 - smoothstep`으로 보정했습니다.
- 최대 960px 렌더 폭·30fps 제한, 화면 밖/비활성 탭 일시 정지, 모션 감소 설정 시 정지 프레임. WebGL 미지원 시 원본 비주얼을 표시합니다.
- 헤더는 화면 상단 고정, 기본 높이 데스크톱 64px / 모바일 56px입니다. 스크롤 24px 이후 56px / 50px로 축소하고 높이·로고 크기를 300ms linear로 전환합니다. 중앙 로고는 제공된 `logo.png`를 사용합니다.
- 부드러운 페이지 스크롤은 Lenis(lerp 0.085)를 사용합니다. 터치는 기본 스크롤을 유지하고 모션 감소 설정에서는 Lenis를 해제합니다.

## Firebase 연결 계획

무료 Spark 요금제를 목표로 **Firebase Anonymous Auth + Cloud Firestore**를 사용합니다. 익명 인증으로 계정 가입 화면 없이 UID를 발급할 수 있습니다. 무료 사용량은 무제한이 아니므로 실제 이용량과 현재 요금 정책을 확인해야 합니다.

`src/store.js`의 `community` 인터페이스를 Firebase 비동기 저장소로 교체하고 `src/hooks/useCommunity.js`에서 구독·비동기 처리·로딩/오류 상태를 연결합니다. 배포 전 Security Rules와 에뮬레이터 검증이 필요합니다. Firebase SDK와 실제 규칙은 현재 골격에 포함하지 않았습니다.

제안 데이터 모델:

| 경로 | 주요 필드 | 권한 |
| --- | --- | --- |
| `events/{eventId}` | title, date, venue, status | 공개 읽기 / 관리자 쓰기 |
| `matches/{matchId}` | eventId, fighterIds, status, closesAt | 공개 읽기 / 관리자 쓰기 |
| `fighters/{fighterId}` | name, weight, image, record | 공개 읽기 / 관리자 쓰기 |
| `matches/{matchId}/votes/{uid}` | fighterId, updatedAt | 본인 읽기·쓰기, 허용 선수·마감 검증 |
| `matches/{matchId}/comments/{commentId}` | uid, text, createdAt, status | 인증 사용자 생성 / 관리자 숨김 |
| `matchStats/{matchId}` | counts, total, updatedAt | 공개 읽기 / 신뢰된 집계 경로만 쓰기 |
| `rankings/{weight}` | championId, fighterIds, source, updatedAt | 공개 읽기 / 관리자 쓰기 |

- 공개 페이지에서 투표자 UID나 비공개 댓글 정보를 노출하지 않습니다. 댓글 공개용 투영 데이터와 비공개 소유 정보를 분리하는 것을 권장합니다.
- 투표는 대진별 UID당 한 문서. 비율 집계를 클라이언트가 임의 수정하게 두지 않습니다. 원본 투표 컬렉션 전체 공개도 피합니다.
- 서버 없는 Spark 범위 유지 시 집계 갱신 방식(규칙으로 검증한 원자적 갱신 또는 관리자 집계)을 먼저 확정해야 합니다. 서버 집계 및 예약 작업을 도입할 경우 비용·요금제 조건을 별도로 검토합니다.
- 익명 UID는 사람당 1표를 보장하지 않습니다. App Check, 작성 빈도 제한, 신고·숨김, 투표 마감, 운영 정책을 정한 뒤 공개합니다.

## 유튜브 자동 연동

블랙컴뱃 공식 채널 `UC_IYjiKaQBPq-K1Iq4sM-UQ`을 연결했습니다. 게시일 내림차순 최신 5개를 큰 영상 1개 + 작은 영상 4개로 표시하고, 클릭하면 YouTube 영상이 새 탭에서 열립니다. 영상 제목과 업로드 날짜도 함께 표시합니다.

- 기본 경로는 API 키가 필요 없는 YouTube 공개 Atom 피드입니다. 브라우저에서 외부 피드를 직접 호출하거나 공개 CORS 프록시를 사용하지 않습니다.
- 로컬 `npm run dev` / `npm run preview`와 Vercel 모두 `/api/youtube`를 호출합니다. `api/youtube.js` 핸들러를 Vite 미들웨어와 Vercel Functions에서 공통으로 사용합니다.
- 방문 시 및 열린 화면에서 10분마다 조회합니다. 서버 메모리 캐시는 10분이며, Vercel CDN에는 남은 캐시 유효 시간만 전달해 중복 캐시로 갱신이 지연되지 않게 합니다. 서버리스 메모리 캐시는 인스턴스별이므로 전체 요청 공유는 CDN이 담당합니다.
- Vercel에는 저장소 전체를 배포해야 합니다. `dist/`만 다른 정적 호스팅에 올리면 `/api/youtube` 함수는 실행되지 않습니다. Vercel 운영에서는 영상 갱신을 위해 재빌드·재배포할 필요가 없습니다.
- `npm run build` 전 `npm run sync:youtube`로 갱신하는 `public/data/youtube.json`은 피드 장애 시 예비 목록입니다. 장애 시에는 이 목록을 캐시하지 않고 반환하며, 사용자 화면에는 지연 안내 문구 없이 영상을 표시합니다. 저장본이 항상 최신이라는 의미는 아닙니다.
- 피드와 저장본 모두 실패하면 공식 채널 링크를 표시합니다. 임의 예시 영상을 최신 영상처럼 표시하지 않습니다.
- 선택적으로 `site.youtube.apiKey`를 입력하면 기존 업로드 재생목록 API 경로를 사용합니다. 이 경우 방문 시 조회 및 10분마다 재조회합니다.

1. Google Cloud에서 YouTube Data API v3 활성화.
2. 공식 채널의 `channels.list(part=contentDetails)` 응답에서 업로드 재생목록 ID 확인.
3. API 키를 웹사이트 HTTP referrer 및 YouTube API로 제한.
4. 일일 할당량을 확인하고 트래픽 증가 시 캐시·서버 동기화를 검토.

서버 예약 작업 없이 방문 요청으로 동작합니다. 선택적 YouTube Data API 경로를 사용할 경우 브라우저 키는 사용자에게 노출되므로 서버 비밀 키를 입력하면 안 됩니다.

공식 문서: [업로드 영상 조회](https://developers.google.com/youtube/v3/guides/implementation/videos), [playlistItems.list](https://developers.google.com/youtube/v3/docs/playlistItems/list).

## 경기 결과 / 랭킹 API 검토

2026-10-26 공개 검색 범위에서 블랙컴뱃이 제공하는 공식 공개 경기/랭킹 API 문서를 확인하지 못했습니다. API가 없다고 확정한 것은 아닙니다. 단체에 데이터 제공·사용 권한·갱신 주기를 문의한 뒤 공급자 어댑터를 추가합니다. 확인 전에는 공식 발표를 바탕으로 관리자가 갱신하는 구조를 기본으로 하고, 임의의 비공식 API나 스크래핑에 의존하지 않습니다.

참고: [Firebase 익명 인증](https://firebase.google.com/docs/auth/web/anonymous-auth), [Security Rules](https://firebase.google.com/docs/rules/basics), [요금제](https://firebase.google.com/pricing).

## 검증 기록 · 2026-10-26

- 미디어: 공식 피드 최신 5개 실제 동기화, 게시일 정렬·피드 입력 검증·새 탭 영상 URL 이동, CHAMP 바로 다음 배치 및 360/390/768/1440px 가로 넘침 없음 확인. 랭킹보기 Song Myung 24px·opacity 0.4 확인.
- 브랜딩: Hero 바로 다음 배치·로컬 폰트 실제 로딩·제목 65px/400·부제 24px/700·본문 18px/300/23.4px 확인. 360/390/768/1440/1920px 가로 넘침 없음, 데스크톱·모바일 캡처 확인, 응원 동작·빌드 통과.
- 전체 텍스처: 문서 높이 및 repeat 속성 확인, 브랜드 소개·스토어·푸터에서 레이어 유무에 따른 스크린샷 차이를 비교해 실제 표시 확인. 페이지네이션 비활성 30%·광도·SVG 필터, 활성 원본, 슬라이드·응원·메뉴 클릭 통과와 모바일 가로 넘침 없음 확인.
- 메인 비주얼: 실제 이미지 로딩·WebGL 스모그 픽셀 출력·클릭 통과, 1장 상태 화살표 비활성, 테스트 전용 2장 구성에서 화살표·페이지네이션·드래그 전환·자동재생 없음 확인. 헤더 상단 고정·스크롤 후 축소·Lenis 휠 스크롤·메뉴도 확인했습니다.
- React 전환 후 프로덕션 빌드에서 아래 브라우저 검증을 재실행했습니다. 이전 버전 저장 데이터 호환, 대진 전환 시 입력 초안·글자 수·안내 초기화도 확인했습니다.
- `npm run build` 통과, `git diff --check` 통과.
- Edge headless: 응원 반복 클릭 시 중복 증가 없음, 선택 변경, 0표 대진, 댓글 새로고침 유지·대진별 분리, HTML 형태 댓글의 텍스트 처리 확인.
- 체육관 탭, 모바일 메뉴 열기·섹션 이동 후 닫힘 확인.
- 360 / 390 / 768 / 1440px 가로 넘침 없음, 페이지 JavaScript 오류 없음.
- 데스크톱·모바일 전체 화면 캡처 확인.
- Firebase 실제 접속·보안 규칙과 실제 YouTube API 응답은 설정 미제공으로 검증하지 않았습니다.
