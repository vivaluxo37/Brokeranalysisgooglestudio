// Mock for set-cookie-parser to fix ESM import issues

export function parse(setCookieStr: string | string[] | undefined) {
  if (!setCookieStr) return [];
  const cookies = Array.isArray(setCookieStr) ? setCookieStr : [setCookieStr];
  return cookies.map(str => {
    const parts = str.split(';').map(p => p.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');
    
    const cookie: any = { name, value };
    
    attributes.forEach(attr => {
      const [key, val] = attr.split('=');
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'httponly') cookie.httpOnly = true;
      else if (lowerKey === 'secure') cookie.secure = true;
      else if (lowerKey === 'samesite') cookie.sameSite = val;
      else if (lowerKey === 'path') cookie.path = val;
      else if (lowerKey === 'domain') cookie.domain = val;
      else if (lowerKey === 'expires') cookie.expires = new Date(val);
      else if (lowerKey === 'max-age') cookie.maxAge = parseInt(val);
    });
    
    return cookie;
  });
}

export function parseString(setCookieStr: string) {
  return parse(setCookieStr);
}

export function splitCookiesString(cookiesString: string | undefined): string[] {
  if (!cookiesString || typeof cookiesString !== 'string') {
    return [];
  }

  const cookies: string[] = [];
  let currentCookie = '';
  let inQuotes = false;
  let depth = 0;

  for (let i = 0; i < cookiesString.length; i++) {
    const char = cookiesString[i];
    
    if (char === '"' && cookiesString[i - 1] !== '\\') {
      inQuotes = !inQuotes;
    }
    
    if (!inQuotes) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      // Split on comma only if we're not inside quotes or parentheses
      if (char === ',' && depth === 0) {
        // Check if this is a date comma (e.g., "Mon, 01-Jan-2024")
        const nextChar = cookiesString[i + 1];
        const prevChars = currentCookie.slice(-4);
        
        if (!/\w{3}$/.test(prevChars) || (nextChar && /\d/.test(nextChar))) {
          // This comma is likely part of a date, don't split
          currentCookie += char;
        } else {
          // This is a cookie separator
          if (currentCookie.trim()) {
            cookies.push(currentCookie.trim());
          }
          currentCookie = '';
          continue;
        }
      } else {
        currentCookie += char;
      }
    } else {
      currentCookie += char;
    }
  }
  
  // Add the last cookie
  if (currentCookie.trim()) {
    cookies.push(currentCookie.trim());
  }
  
  return cookies;
}

// Default export
const setCookieParser = {
  parse,
  parseString,
  splitCookiesString
};

export default setCookieParser;
