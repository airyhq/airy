import {isThisWeek, isToday} from './compare';

export function formatTime(sentAt: string | number | Date) {
  if (!sentAt) {
    return '';
  }

  const sentAtDate = new Date(sentAt);

  if (isToday(sentAtDate)) {
    return sentAtDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
  }

  if (isThisWeek(sentAtDate)) {
    return sentAtDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  return sentAtDate.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

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
