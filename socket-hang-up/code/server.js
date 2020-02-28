const http = require('http')

const slowDown = process.env.SLOWDOWN_MS || 200
const hostname = '0.0.0.0'
const port = 3000
const multiplier = 5000

const server = http.createServer((req, res) => {
  console.log('Request being handled ...')
  if (req.url.endsWith('memory')) {
    const obj = {}

    for (let i = 0; i < multiplier; i++) {
      const arr = new Array(multiplier).fill(multiplier)
      obj[i] = JSON.parse(JSON.stringify(arr))
    }
    console.log('Using memory')
    res.end(JSON.stringify(obj) + '\n')
    return
  }

  if (req.url.endsWith('destroy')) {
    console.log('DESTROY THIS SOCKET')
    return req.socket.destroy()
  }

  if (req.url.endsWith('end')) {
    console.log('END THIS SOCKET')
    return req.socket.end()
  }

  setTimeout(() => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(slowDown + '\n')
    console.log('Request being served.')
  }, slowDown)
})

setInterval(() => {
  const memoryUsage = process.memoryUsage()
  console.log(Object.keys(memoryUsage).reduce((p, c) => {
    p[c] = p[c] / 1024 / 1024
    return p;}, memoryUsage))
}, 5000)

server.on('close', () => {
  console.log('Connection closed.')
})
server.on('connection', (s) => {
  console.log('>> Request')
// s.end() // Half-closes the socket. i.e., it sends a FIN packet. It is possible the server will still send some data.
// s.destroy() // Ensures that no more I/O activity happens on this socket. Only necessary in case of errors (parse error or so).
// s.write('EEE')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
