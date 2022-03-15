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
