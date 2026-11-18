export function isYouTubeShort({ title = '', url = '' }) {
  return /(?:^|[^\p{L}\p{N}_])#(?:shorts?|쇼츠)(?![\p{L}\p{N}_])/iu.test(title)
    || /^(?:https?:\/\/(?:[\w-]+\.)?youtube\.com)?\/shorts\//i.test(url);
}
