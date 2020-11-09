export function setCookie(name, value, domain, days = 3650) {
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  } else {
    expires = '';
  }

  let setDomain = '';

  if (domain) {
    setDomain = `; domain=${domain}`;
  }

  document.cookie = `${name}=${value}${expires}${setDomain}; path=/`;
}

export function getCookie(cookieName): string | null {
  if (document.cookie.length > 0) {
    let cookieStart = document.cookie.indexOf(`${cookieName}=`);
    if (cookieStart !== -1) {
      cookieStart = cookieStart + cookieName.length + 1;
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(cookieStart, cookieEnd));
    }
  }

  return null;
}
