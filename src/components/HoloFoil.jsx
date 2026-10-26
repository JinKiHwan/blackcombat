// 금박 무늬와 반사광이 불규칙하게 일렁이는 효과입니다.
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
