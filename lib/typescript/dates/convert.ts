export const timeElapsedInHours = (sentAt: Date) => {
  const millisecondsDiff = new Date().getTime() - new Date(sentAt).getTime();
  const seconds = (millisecondsDiff / 1000).toFixed(0);
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours;
  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60);
    hours = hours >= 10 ? hours : '0' + hours;
    minutes = (Number(minutes) - hours * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : '0' + minutes;
  }
  if (!hours) {
    hours = '00';
  }
  if (!minutes) {
    minutes = '00';
  }
  return parseFloat(hours + '.' + minutes);
};
