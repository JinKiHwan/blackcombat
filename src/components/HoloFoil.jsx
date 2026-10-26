// 전달받은 HoloCard 사용 예시의 시각 옵션을 카드 레이아웃과 분리합니다.
// 3D 회전·확대 없이 CSS 금박 입자와 반사광만 표시합니다.
export default function HoloFoil({ intensity = 0.35, edgeSparkle = 0.8, frame = 4, glare = 0.5 }) {
  return (
    <div className="champ-holo" aria-hidden="true" style={{
      '--holo-intensity': intensity,
      '--holo-edge': edgeSparkle,
      '--holo-frame': `${frame}px`,
      '--holo-glare': glare,
    }} />
  );
}
