export const countWords = (text) => {
  const words = text.match(/\w+/g);
  return words ? words.length : 0;
};
