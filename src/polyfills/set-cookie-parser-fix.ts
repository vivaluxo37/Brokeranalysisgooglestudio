// Lightweight, ESM-friendly re-implementation of the "set-cookie-parser" package.
// This mirrors the behaviour of the original CommonJS module while avoiding
// the `module` global that causes runtime failures in ESM bundles.

type Cookie = {
  name: string
  value: string
  expires?: Date
  maxAge?: number
  secure?: boolean
  httpOnly?: boolean
  sameSite?: string
  partitioned?: boolean
  [key: string]: unknown
}

type ParseOptions = {
  decodeValues?: boolean
  map?: boolean
  silent?: boolean
}

const defaultParseOptions: Required<ParseOptions> = {
  decodeValues: true,
  map: false,
  silent: false,
}

const isNonEmptyString = (str: unknown): str is string =>
  typeof str === 'string' && str.trim().length > 0

const parseNameValuePair = (nameValuePairStr: string) => {
  const nameValueArr = nameValuePairStr.split('=')
  let name = ''
  let value = ''

  if (nameValueArr.length > 1) {
    name = nameValueArr.shift() ?? ''
    value = nameValueArr.join('=')
  } else {
    value = nameValuePairStr
  }

  return { name, value }
}

const decode = (value: string, options: Required<ParseOptions>) => {
  if (!options.decodeValues) {return value}

  try {
    return decodeURIComponent(value)
  } catch (error) {
    if (!options.silent) {
      console.error(
        `set-cookie-parser encountered an error while decoding a cookie with value '${
          value
        }'. Set options.decodeValues to false to disable this feature.`,
        error,
      )
    }
    return value
  }
}

export const splitCookiesString = (cookiesString: unknown): string[] => {
  if (Array.isArray(cookiesString)) {
    return cookiesString
  }

  if (typeof cookiesString !== 'string') {
    return []
  }

  const cookiesStrings: string[] = []
  let pos = 0
  let start = 0
  let ch: string
  let lastComma = 0
  let nextStart = 0
  let cookiesSeparatorFound = false

  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1
    }
    return pos < cookiesString.length
  }

  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos)
    return ch !== '=' && ch !== ';' && ch !== ','
  }

  while (pos < cookiesString.length) {
    start = pos
    cookiesSeparatorFound = false

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos)
      if (ch === ',') {
        lastComma = pos
        pos += 1

        skipWhitespace()
        nextStart = pos

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1
        }

        if (pos < cookiesString.length && cookiesString.charAt(pos) === '=') {
          cookiesSeparatorFound = true
          pos = nextStart
          cookiesStrings.push(cookiesString.substring(start, lastComma))
          start = pos
        } else {
          pos = lastComma + 1
        }
      } else {
        pos += 1
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length))
    }
  }

  return cookiesStrings
}

export const parseString = (setCookieValue: string, options?: ParseOptions): Cookie => {
  const opts: Required<ParseOptions> = { ...defaultParseOptions, ...options }
  const parts = setCookieValue.split(';').filter(isNonEmptyString)

  const nameValuePairStr = parts.shift() ?? ''
  const parsed = parseNameValuePair(nameValuePairStr)
  const {name} = parsed
  const value = decode(parsed.value, opts)

  const cookie: Cookie = { name, value }

  parts.forEach((part) => {
    const sides = part.split('=')
    const key = (sides.shift() ?? '').trim().toLowerCase()
    const remainder = sides.join('=')

    switch (key) {
      case 'expires':
        cookie.expires = new Date(remainder)
        break
      case 'max-age':
        cookie.maxAge = parseInt(remainder, 10)
        break
      case 'secure':
        cookie.secure = true
        break
      case 'httponly':
        cookie.httpOnly = true
        break
      case 'samesite':
        cookie.sameSite = remainder
        break
      case 'partitioned':
        cookie.partitioned = true
        break
      default:
        cookie[key] = remainder
        break
    }
  })

  return cookie
}

export const parse = (
  input: string | string[] | { headers?: Record<string, any> } | undefined,
  options?: ParseOptions,
): Cookie[] | Record<string, Cookie> => {
  const opts: Required<ParseOptions> = { ...defaultParseOptions, ...options }

  if (!input) {
    return opts.map ? {} : []
  }

  let cookiesInput: string | string[] = input as string | string[]

  if (typeof input === 'object' && 'headers' in input && input.headers) {
    const {headers} = input

    if (typeof headers.getSetCookie === 'function') {
      cookiesInput = headers.getSetCookie()
    } else if (headers['set-cookie']) {
      cookiesInput = headers['set-cookie']
    } else {
      const headerKey = Object.keys(headers).find(
        (key) => key.toLowerCase() === 'set-cookie',
      )

      if (headerKey) {
        cookiesInput = headers[headerKey]
      } else if (headers.cookie && !opts.silent) {
        console.warn(
          'Warning: set-cookie-parser appears to have been called on a request object. ' +
            'It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. ' +
            'Set the option {silent: true} to suppress this warning.',
        )
      }
    }
  }

  const normalizedInput = Array.isArray(cookiesInput)
    ? cookiesInput
    : [cookiesInput]

  if (!opts.map) {
    return normalizedInput.filter(isNonEmptyString).map((cookieStr) => parseString(cookieStr, opts))
  }

  const cookies: Record<string, Cookie> = {}

  normalizedInput.filter(isNonEmptyString).forEach((cookieStr) => {
    const cookie = parseString(cookieStr, opts)
    cookies[cookie.name] = cookie
  })

  return cookies
}

const setCookieParser = {
  parse,
  parseString,
  splitCookiesString,
}

export default setCookieParser
