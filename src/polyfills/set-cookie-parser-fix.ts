// Polyfill for set-cookie-parser splitCookiesString
import * as setCookieParser from 'set-cookie-parser';

// Fallback implementation for splitCookiesString
const fallbackSplitCookiesString = (cookiesString: string): string[] => {
  if (!cookiesString) return [];
  return cookiesString.split(';').map(cookie => cookie.trim());
};

// Try to use the library's implementation if available, otherwise use fallback
const splitCookiesStringImplementation = (cookiesString: string): string[] => {
  try {
    if (setCookieParser && setCookieParser.splitCookiesString) {
      return setCookieParser.splitCookiesString(cookiesString);
    }
  } catch (e) {
    console.warn('set-cookie-parser splitCookiesString not available, using fallback');
  }
  return fallbackSplitCookiesString(cookiesString);
};

// Export the function with the correct name for react-router
export const splitCookiesString = splitCookiesStringImplementation;
export default splitCookiesString;
