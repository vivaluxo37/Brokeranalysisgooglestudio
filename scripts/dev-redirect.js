#!/usr/bin/env node

// Lightweight redirect helper to ensure requests to port 5173
// are forwarded to the active development server port (defaults to 3000).

import http from 'node:http'

const [, , argTarget, argPorts] = process.argv

const TARGET_PORT = Number(process.env.DEV_REDIRECT_TARGET || argTarget || 3000)
const portSpec = process.env.DEV_REDIRECT_PORTS || process.env.DEV_REDIRECT_PORT || argPorts || '5173'
const REDIRECT_HOST = process.env.DEV_REDIRECT_HOST || 'localhost'

const REDIRECT_PORTS = portSpec
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((value, index, array) => Number.isInteger(value) && value > 0 && array.indexOf(value) === index)

if (!Number.isInteger(TARGET_PORT) || TARGET_PORT <= 0) {
  console.error('[redirect] Invalid target port provided. Please pass a valid port number.')
  process.exit(1)
}

let hasLoggedReady = false

const buildLocation = (req) => {
  const requestPath = req?.url || '/'
  return `http://${REDIRECT_HOST}:${TARGET_PORT}${requestPath}`
}

const servers = REDIRECT_PORTS.map((redirectPort) => {
  const server = http.createServer((req, res) => {
    const location = buildLocation(req)
    res.writeHead(307, {
      Location: location,
      'Cache-Control': 'no-store',
    })
    res.end()
  })

  server.on('upgrade', (req, socket) => {
    const location = buildLocation(req)
    const response = [
      'HTTP/1.1 307 Temporary Redirect',
      `Location: ${location}`,
      'Connection: close',
      '',
      '',
    ].join('\r\n')
    socket.write(response)
    socket.destroy()
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`⚠️  Redirect server could not bind to port ${redirectPort} (already in use).`)
    } else {
      console.error('Redirect server encountered an error:', error)
    }
  })

  server.listen(redirectPort, REDIRECT_HOST, () => {
    console.log(
      `🔁 Redirecting http://${REDIRECT_HOST}:${redirectPort} -> http://${REDIRECT_HOST}:${TARGET_PORT}`
    )
    hasLoggedReady = true
  })

  return server
})

const shutdown = () => {
  let remaining = servers.length
  if (remaining === 0) {
    process.exit(0)
    return
  }
  servers.forEach((server) => {
    server.close(() => {
      remaining -= 1
      if (remaining === 0) {
        process.exit(0)
      }
    })
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
