// Firebase 도입 시 이 인터페이스를 유지하고 구현을 교체합니다.
// 데모에서는 브라우저별 데이터만 저장하며 실제 방문자 집계를 제공하지 않습니다.
const KEY = 'blackcombat-demo-v1';
function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch { return {}; }
}
function write(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch { throw new Error('브라우저 저장 공간을 사용할 수 없습니다. 저장 설정을 확인해주세요.'); }
}
export const community = {
  getVote(matchId) {
    const vote = read()[matchId]?.vote;
    return vote === 0 || vote === 1 ? vote : null;
  },
  vote(matchId, side) {
    if (![0, 1].includes(side)) throw new Error('올바른 선수를 선택해주세요.');
    const data = read();
    data[matchId] = { ...data[matchId], vote: side };
    write(data);
  },
  getComments(matchId) {
    const comments = read()[matchId]?.comments;
    return Array.isArray(comments) ? comments.filter(c => typeof c?.text === 'string' && typeof c?.createdAt === 'string').slice(0, 50) : [];
  },
  addComment(matchId, value) {
    const text = value.trim();
    if (!text || text.length > 200) throw new Error('응원을 1~200자로 입력해주세요.');
    const data = read();
    const comments = this.getComments(matchId);
    data[matchId] = { ...data[matchId], comments: [{ text, createdAt: new Date().toISOString() }, ...comments].slice(0, 50) };
    write(data);
  },
};
