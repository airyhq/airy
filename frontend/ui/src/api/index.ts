export const fetchGoogleFonts = () => {
  //The API key is safe for embedding in URLs; it doesn't need any encoding. (Google docs)
  const url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBtQiPkuSBRhUREStucv0KhI8Qc1HMV6Dc';
  const fontFamilies: string[] = [];

  fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => {
      response.items.forEach(font => {
        fontFamilies.push(font.family);
      });
    })
    .catch((error: Error) => {
      console.log(error);
    });
  return fontFamilies;
};
