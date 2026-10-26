import { useCallback, useEffect, useState } from 'react';
import { community } from '../store.js';

// 화면 상태와 저장소 접근을 분리합니다. 기존 저장 키·대진 ID는 그대로 유지합니다.
export function useCommunity(matchId) {
  const read = useCallback(() => ({
    chosen: community.getVote(matchId),
    comments: community.getComments(matchId),
  }), [matchId]);
  const [state, setState] = useState(read);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [read]);

  function vote(side) {
    community.vote(matchId, side);
    setState(read());
  }

  function addComment(text) {
    community.addComment(matchId, text);
    setState(read());
  }

  return { ...state, vote, addComment };
}
