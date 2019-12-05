const http = require('http')

const slowDown = process.env.SLOWDOWN_MS || 200
const hostname = '0.0.0.0'
const port = 3000

const server = http.createServer((req, res) => {
  setTimeout(() => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(slowDown + '\n')
  }, slowDown)
})

server.on('connection', (s) => {
  console.log('>> Request')
  // s.end() // Half-closes the socket. i.e., it sends a FIN packet. It is possible the server will still send some data.
  s.destroy() // Ensures that no more I/O activity happens on this socket. Only necessary in case of errors (parse error or so).

})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
