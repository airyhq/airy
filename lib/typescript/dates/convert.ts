export const timeElapsedInHours = (sentAt: Date) => {
  const millisecondsDiff = new Date().getTime() - new Date(sentAt).getTime();
  return (millisecondsDiff / (1000 * 60 * 60)) % 24;
};
