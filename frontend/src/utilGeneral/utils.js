// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};
