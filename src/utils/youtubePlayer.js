let apiPromise;
export function loadYouTubePlayer() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const timeout = setTimeout(() => { apiPromise = undefined; reject(new Error('YouTube 연결 시간이 초과되었습니다.')); }, 12000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      previous?.();
      resolve(window.YT);
    };
    let script = document.querySelector('script[data-bc-youtube-api]');
    if (!script) {
      script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true; script.dataset.bcYoutubeApi = 'true';
      document.head.append(script);
    }
    script.onerror = () => { clearTimeout(timeout); script.remove(); apiPromise = undefined; reject(new Error('YouTube에 연결하지 못했습니다.')); };
  });
  return apiPromise;
}
