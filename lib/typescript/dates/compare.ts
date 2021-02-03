export function isToday(date: Date) {
  return new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
}

export function isThisWeek(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const beginningOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  return date > beginningOfWeek;
}

export function isSameDay(firstDate: Date, secondDate: Date) {
  return new Date(firstDate).setHours(0, 0, 0, 0) === new Date(secondDate).setHours(0, 0, 0, 0);
}
