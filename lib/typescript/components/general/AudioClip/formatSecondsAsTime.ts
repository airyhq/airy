export function formatSecondsAsTime(secs) {
  const hour = Math.floor(secs / 3600);
  let min: number | string = Math.floor((secs - hour * 3600) / 60);
  let sec: number | string = Math.floor(secs - hour * 3600 - min * 60);

  if (min < 10) {
    min = '0' + min;
  }
  if (sec < 10) {
    sec = '0' + sec;
  }

  return min + ':' + sec;
}
