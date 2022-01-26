import {Message} from 'model';

export function dateFormat(date: Date, fullDate = false) {
  const now = new Date();
  if (!date)
    return now.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });

  if (!fullDate && date.toLocaleDateString() === now.toLocaleDateString()) {
    return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: false});
  } else if (isYesterday(date)) {
    return 'Yesterday ' + date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: false});
  } else if (isThisWeek(date)) {
    return (
      date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      }) +
      ' ' +
      date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: false})
    );
  } else {
    return (
      date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      }) +
      ' ' +
      date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: false})
    );
  }
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

export function formatTimeOfMessageWithHours(message: Message) {
  if (message) {
    const sentAtDate = new Date(message.sentAt);
    if (isToday(sentAtDate)) {
      return sentAtDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    } else if (isThisWeek(sentAtDate)) {
      return (
        sentAtDate.toLocaleDateString('en-GB', {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) +
        ' at ' +
        sentAtDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})
      );
    } else {
      return (
        sentAtDate.toLocaleDateString('en-GB', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) +
        ' at ' +
        sentAtDate.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})
      );
    }
  }
  return '';
}

export function formatDateOfMessage(message: Message) {
  if (!message) {
    return '';
  }

  const sentAtDate = new Date(message.sentAt);
  if (isToday(sentAtDate)) {
    return 'Today';
  } else if (isYesterday(sentAtDate)) {
    return 'Yesterday';
  } else if (isThisWeek(sentAtDate)) {
    return sentAtDate.toLocaleDateString('en-GB', {
      weekday: 'long',
    });
  } else {
    return sentAtDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}

function isToday(date: Date) {
  return new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
}

const MILLISECONDS_IN_A_DAY = 86400000;

function isYesterday(date: Date) {
  return new Date(Date.now() - MILLISECONDS_IN_A_DAY).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
}

export function isMoreThan7Days(date: Date) {
  return new Date(Date.now() - MILLISECONDS_IN_A_DAY * 7) > new Date(date);
}

function isThisWeek(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const beginningOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  return date > beginningOfWeek;
}

export function isAfterFirst(firstTime: Date, toCompare: Date) {
  return new Date(firstTime) < new Date(toCompare);
}
