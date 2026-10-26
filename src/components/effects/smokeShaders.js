// 사용자 제공 스모그 셰이더. 커서 반응 제거 및 역순 smoothstep 보정.
export const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

export const fragmentSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_flowTime;
      uniform float u_density;
      uniform float u_turbulence;
      uniform float u_bottomHeavy;
      uniform float u_wispy;
      uniform vec3 u_color;

      // 2D 의사 난수 및 해시 함수
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      // 부드러운 Gradient Noise (Perlin 스타일)
      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // Quintic 보간으로 매끄러운 연기 결 생성

        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        ) * 0.5 + 0.5;
      }

      // 옥타브 회전 행렬 (연기 결의 격자 아티팩트 제거)
      const mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

      // 기본 Fractal Brownian Motion (부드러운 구름/안개 볼륨)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p = rot * p * 2.03 + vec2(13.5, 7.2);
          a *= 0.5;
        }
        return v;
      }

      // 실연기(Wispy Tendrils) 효과를 위한 리지드(Ridged) FBM
      float wispyFbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        float weight = 1.0;
        for (int i = 0; i < 5; i++) {
          float n = noise(p);
          // 능선(Ridge)을 뒤집어 얇고 날카로운 연기 가닥(Wisps) 생성
          n = 1.0 - abs(n * 2.0 - 1.0);
          n = n * n * weight;
          weight = clamp(n * 1.8, 0.0, 1.0);
          v += a * n;
          p = rot * p * 2.12 + vec2(5.3, 19.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);

        // 화면 비율 보정 좌표
        vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);

        // 좌 -> 우(Left to Right) 수평 이동 및 미세한 상승 기류 벡터
        // 텍스처가 오른쪽(+x)으로 이동하려면 샘플링 좌표에서 이동량을 빼줍니다(-flow)
        float tx = u_flowTime.x * 0.22;
        float ty = u_flowTime.y * 0.18;
        float t = u_time * 0.15;

        // 좌측에서 우측으로 흐르면서 자연스럽게 위아래로 물결치는 기류 왜곡(Stream Wave)
        vec2 streamP = p;
        streamP.y -= sin(p.x * 2.2 - tx * 1.4) * 0.08 * u_turbulence;

        // 1단계 Domain Warping: 좌에서 우로 흐르는 큰 줄기의 기류
        vec2 q = vec2(0.0);
        q.x = fbm(streamP * 1.65 - vec2(tx * 1.35, ty * 0.65));
        q.y = fbm(streamP * 1.65 + vec2(4.2 - tx * 1.15, 1.7 - ty * 0.85));

        // 2단계 Domain Warping: 오른쪽으로 밀려가며 회전하는 소용돌이(Curl) 디테일
        vec2 r = vec2(0.0);
        r.x = fbm(streamP * 2.5 + u_turbulence * 2.4 * q + vec2(1.7 - tx * 1.95, 9.2 - ty * 1.1));
        r.y = fbm(streamP * 2.5 + u_turbulence * 2.4 * q + vec2(8.3 - tx * 1.65, 2.8 - ty * 1.3));

        // 3단계: 부드러운 볼륨 연기 + 좌->우로 길게 뻗어나가는 실연기(Wispy) 레이어 결합
        vec2 warpedPos = streamP * vec2(1.85, 2.35) + r * (1.35 + u_turbulence);
        float baseSmoke = fbm(warpedPos - vec2(tx * 1.6, ty * 0.9));

        // 실연기(Wispy tendrils)는 수평 방향으로 살짝 늘려서 바람에 날리는 결 강조
        vec2 wispyCoord = streamP * vec2(2.1, 2.9) + r * 1.85 - vec2(tx * 2.25, ty * 1.15 + t * 0.2);
        float wispySmoke = wispyFbm(wispyCoord);

        // 두 연기 텍스처를 블렌딩하여 사진 속 스모그 특유의 겹겹이 쌓인 질감 완성
        float combinedSmoke = mix(baseSmoke, wispySmoke * 1.28, 0.48 * u_wispy);
        combinedSmoke = smoothstep(0.16, 0.88, combinedSmoke);

        // 전경(Foreground)에 좌에서 우로 빠르게 스쳐 지나가는 굵은 안개 레이어 추가 (깊이감 부여)
        float fgSmoke = fbm(p * vec2(1.05, 1.3) + q * 1.15 - vec2(tx * 2.75, ty * 0.7));
        fgSmoke = smoothstep(0.25, 0.85, fgSmoke);

        // 공간별 마스크 계산: 왼쪽 및 좌하단에서 풍부하게 유입되어 오른쪽으로 흐르며 퍼지는 구도
        // 1) 하단 베이스 마스크 (우측으로 갈수록 연기가 살짝 위로 피어오르도록 유도)
        float risingLift = uv.x * 0.22;
        float adjustedY = max(0.0, uv.y - risingLift * (1.0 - u_bottomHeavy * 0.5));
        float bottomMask = pow(clamp(1.0 - adjustedY * (0.42 + u_bottomHeavy * 0.58), 0.0, 1.0), 1.3);

        // 2) 좌측 발원지(Left Source) 플룸: 왼쪽에서 짙은 연기가 뿜어져 나오는 효과
        float leftSourcePlume = pow(clamp(1.0 - uv.x * 0.65, 0.0, 1.0), 1.15) * pow(clamp(1.0 - uv.y * 0.65, 0.0, 1.0), 1.1);

        // 3) 중앙 및 우측으로 이어지는 수평 스트림 코어
        float horizontalStream = exp(-pow((uv.y - (0.28 + uv.x * 0.16)) * (1.6 + u_bottomHeavy), 2.0)) * (1.0 - smoothstep(0.15, 1.08, uv.x));

        float spatialEnvelope = clamp(bottomMask * 0.75 + leftSourcePlume * 0.65 + horizontalStream * 0.55, 0.0, 1.25);

        // 가장자리에서 연기가 부자연스럽게 잘리지 않고 구름 모양으로 흩어지도록 노이즈 마스킹
        float edgeErode = smoothstep(0.14, 0.74, combinedSmoke * spatialEnvelope * 1.48);

        // 최종 스모그 밝기 및 밀도 산출
        float finalSmoke = (combinedSmoke * 0.68 + fgSmoke * 0.42) * edgeErode * u_density;

        // 입체적인 명암 대비 (어두운 그림자 골짜기 vs 은빛 하이라이트 능선)
        float highlight = pow(clamp(wispySmoke * r.x * 1.75, 0.0, 1.0), 2.1) * edgeErode;

        // Vantablack(#000000) 배경과 자연스럽게 합성
        vec3 darkShadowColor = u_color * 0.25;
        vec3 midSmokeColor = u_color * 0.78;
        vec3 brightWispColor = min(u_color * 1.35, vec3(1.0));

        vec3 smokeColor = mix(darkShadowColor, midSmokeColor, clamp(finalSmoke, 0.0, 1.0));
        smokeColor = mix(smokeColor, brightWispColor, clamp(highlight * 0.85, 0.0, 1.0));

        float alpha = clamp(finalSmoke * 1.15, 0.0, 1.0);

        // 상단 및 우측 끝단 자연스러운 비네팅 감쇠 처리
        float topVignette = (1.0 - smoothstep(0.72, 1.02, uv.y));
        float rightTrailOff = (1.0 - smoothstep(0.78, 1.05, uv.x * (0.85 + 0.15 * (1.0 - combinedSmoke))));
        alpha *= topVignette * rightTrailOff;

        gl_FragColor = vec4(smokeColor * alpha, alpha);
      }
    `;
