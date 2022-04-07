const generateRandomNumber = () => {
  return Math.floor(Math.random() * 18);
};

export const generateRandomFrequencies = (): number[] => {
  return Array(20).fill(0).map(generateRandomNumber);
};
