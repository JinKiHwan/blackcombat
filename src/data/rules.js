export const rulebooks = {
  pro: {
    source: 'https://www.blackcombat-official.com/rules.php', updated: '2026.07.22',
    sections: [
      { id: 'divisions', ko: ['체급', '일반 경기의 허용 오차는 500g이며, 타이틀전·합의된 계약 체중에는 적용하지 않습니다.'], en: ['Weight divisions', 'A 500g allowance applies except in title or agreed catchweight bouts.'] },
      { id: 'weigh-in', ko: ['계체와 의료', '지각·계체 실패에는 제재가 따릅니다. 체중 초과에 따른 감점·대전료·리게인 조건을 원문에서 확인하세요.'], en: ['Weigh-in & medical', 'Lateness and weight failures incur sanctions. Check deductions, purse penalties and regain requirements in the rulebook.'] },
      { id: 'format', ko: ['경기 진행', '원칙적으로 5분 3라운드, 라운드 사이 휴식은 1분입니다.'], en: ['Bout format', 'Normally three five-minute rounds, with one-minute intervals.'] },
      { id: 'scoring', ko: ['채점과 승패', '10점 필수제를 사용합니다. 데미지·지배력, 유효 공격, 적극성 순으로 평가하며 연장은 별도 절차를 따릅니다.'], en: ['Scoring & outcomes', 'Ten-point must scoring prioritizes damage/dominance, effective offense, then aggression. Extensions require a separate vote.'] },
      { id: 'equipment', ko: ['장비', '승인된 복장·글러브·핸드랩과 개인 마우스피스·파울컵이 필요합니다.'], en: ['Equipment', 'Approved attire, gloves, wraps, mouthguard and groin protector are required.'] },
      { id: 'conduct', ko: ['반칙과 이의', '반칙은 경고·감점·실격 사유가 됩니다. 판정 이의는 경기 종료 후 48시간 이내에 증거와 함께 제출합니다.'], en: ['Fouls & appeals', 'Fouls may trigger warnings, deductions or disqualification. Submit evidenced appeals within 48 hours.'] },
    ],
    weights: [
      ['아톰급', 'Atomweight', '≤ 48'], ['스트로급', 'Strawweight', '48.1–52.2'],
      ['플라이급', 'Flyweight', '52.3–56.7'], ['밴텀급', 'Bantamweight', '56.8–61.3'],
      ['페더급', 'Featherweight', '61.4–65.8'], ['라이트급', 'Lightweight', '65.9–70.4'],
      ['웰터급', 'Welterweight', '70.5–77.1'], ['미들급', 'Middleweight', '77.2–84'], ['헤비급', 'Heavyweight', '84.1–120'],
    ],
  },
  amateur: {
    source: 'https://www.blackcombat-official.com/rules.php?ruleType=amateur', updated: null,
    sections: [
      { id: 'divisions', ko: ['체급', '남성부와 여성부의 체급이 구분됩니다. 허용 오차는 500g입니다.'], en: ['Weight divisions', 'Separate male and female divisions apply, with a 500g allowance.'] },
      { id: 'weigh-in', ko: ['계체', '1차 실패 시 지정된 30분 안에 재계체합니다. 최종 실패는 감점·실격 또는 경기 무효로 이어질 수 있습니다.'], en: ['Weigh-in', 'A failed first attempt allows a 30-minute reweigh. Final failure may mean deductions, disqualification or no contest.'] },
      { id: 'format', ko: ['경기 진행', '아마추어는 3분 2라운드, 세미프로는 3분 3라운드로 진행합니다.'], en: ['Bout format', 'Amateur bouts have two three-minute rounds; semi-professional bouts have three.'] },
      { id: 'scoring', ko: ['채점과 승패', '10점 필수제를 적용하며, 최종 동점은 무승부로 처리합니다.'], en: ['Scoring & outcomes', 'Ten-point must scoring applies. Tied final scores result in a draw.'] },
      { id: 'equipment', ko: ['보호 장비', '공식 스파링 글러브·신가드를 사용합니다. 한 선수라도 헤드기어 착용을 원하면 양측 모두 착용합니다.'], en: ['Protective equipment', 'Official sparring gloves and shin guards are used. Both fighters wear headgear if either requests it.'] },
      { id: 'conduct', ko: ['반칙과 안전', '허용 기술과 반칙은 프로 규정과 구분해 확인하세요. 선수 보호를 위해 빠른 경기 중단이 가능합니다.'], en: ['Fouls & safety', 'Check amateur-specific permitted techniques and fouls. Protective early stoppages may apply.'] },
    ],
    weights: [
      ['여성 아톰급', "Women's atomweight", '≤ 48'], ['남성 플라이급', "Men's flyweight", '≤ 56.7'],
      ['남성 밴텀급', "Men's bantamweight", '56.8–61.3'], ['남성 페더급', "Men's featherweight", '61.4–65.8'],
      ['남성 라이트급', "Men's lightweight", '65.9–70.4'], ['남성 웰터급', "Men's welterweight", '70.5–77.1'],
      ['남성 미들급', "Men's middleweight", '77.2–84'], ['남성 중량급', "Men's 100kg division", '84.1–100'], ['남성 헤비급', "Men's heavyweight", '≤ 120'],
    ],
  },
};
