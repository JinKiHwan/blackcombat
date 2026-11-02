# 최신 영상 업데이트

## Vercel 설정

프로젝트: blackcombat_renewal
Environment Variables에서 `YOUTUBE_API_KEY`를 Production과 Preview에 추가합니다.
Google Cloud에서 YouTube Data API v3를 활성화한 프로젝트의 키를 사용하고, API 제한은 YouTube Data API v3로 설정합니다.
브라우저용 HTTP referrer 제한 키가 아닌 서버에서 호출 가능한 키가 필요합니다.
키를 Git, src/data.js 또는 VITE_ 변수에 저장하지 마세요.
환경변수 추가 후 재배포해야 적용됩니다.

## 동작

1. 서버 환경변수의 키로 업로드 재생목록을 조회합니다.
2. 실패하거나 키가 없으면 기존 RSS → 채널 페이지 수집을 시도합니다.
3. 정상 결과는 최대 10분 동안 캐시합니다.
4. 수집 실패 시 마지막 메모리 목록 또는 빌드 예비 목록을 사용하고 `stale: true`를 반환합니다.
5. 예비 목록을 표시 중임을 화면에 안내하며 실패 응답은 CDN에 캐시하지 않습니다.
6. 방문 시 및 열린 화면에서 10분 간격으로 다시 확인합니다.

`/api/youtube` 응답의 `source: "data-api"`와 최근 `fetchedAt`을 확인하면 서버 API 연결이 정상입니다.
`stale: true`이면 정상 갱신이 아닙니다. Vercel Logs에서 `[YouTube] refresh failed`를 확인하세요.
키 자체는 응답이나 진단 로그에 포함되지 않습니다.

검증: `node --test tests/youtube-feed.test.mjs`
