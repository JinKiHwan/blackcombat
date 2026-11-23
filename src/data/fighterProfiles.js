import roster from '../../data/imports/blackcombat-fighters.json' with { type: 'json' };
import numbering from '../../data/imports/numbering17-official.json';
import numberingProfiles from '../../data/imports/numbering17-profiles.json' with { type: 'json' };

const rankedFighters = new Map(roster.fighters.map(fighter => [fighter.fighterId, fighter]));
const numberingFighters = new Map(numbering.matches.flatMap(match =>
  match.fighterIds.map((id, side) => [id, {
    ringName: match.names[side],
    name: match.realNames[side],
    record: match.records[side],
  }]),
));

export function fighterHref(id) {
  return rankedFighters.has(id) || numberingFighters.has(id) ? `/fighter/${id}` : null;
}

export function fighterProfile(id) {
  const fighter = rankedFighters.get(id);
  const bout = numberingFighters.get(id);
  if (!fighter && !bout) return null;
  const profile = numberingProfiles.profiles[id];
  const rankings = roster.rankings.filter(row => row.fighterId === id);

  return {
    ringName: fighter?.ringName ?? bout.ringName,
    name: fighter?.name ?? bout?.name,
    countryCode: profile?.countryCode ?? fighter?.countryCode,
    image: profile?.image ?? fighter?.profileImage?.localPath,
    imageKind: profile?.imageKind,
    profileUrl: profile?.sourceUrl ?? fighter?.profileUrl,
    height: profile?.height ?? fighter?.height,
    age: profile?.age ?? fighter?.age,
    team: profile?.team && profile.team !== 'N/A' ? profile.team : fighter?.team,
    record: bout?.record ?? rankings[0]?.recordRaw,
    rankings,
  };
}
