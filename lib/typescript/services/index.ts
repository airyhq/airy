import {Message} from 'httpclient';

export function isToday(date: Date) {
    return new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
  }
  
export function isThisWeek(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const beginningOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    return date > beginningOfWeek;
  }
  
export function formatTimeOfMessage(message: Message) {
    if (message) {
      const sentAtDate = new Date(message.sentAt);
      if (isToday(sentAtDate)) {
        return sentAtDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
      } else if (isThisWeek(sentAtDate)) {
        return sentAtDate.toLocaleDateString('en-GB', {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } else {
        return sentAtDate.toLocaleDateString('en-GB', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
    }
    return '';
  }