const net = require('net')

const frontEnd = net.createServer((frontEndSocket) => {
  // 'connection' listener.

  const backEndSocket = net.connect(3000, 'server')

  console.log('client connected')
  frontEndSocket.on('end', () => {
    console.log('client disconnected')
  })

  frontEndSocket.on('data', d => backEndSocket.write(d))
  backEndSocket.on('data', d => frontEndSocket.write(d))

  backEndSocket.on('error', (err) => {
    console.error('BackEndSocket', err)
    frontEndSocket.destroy()
  })

  frontEndSocket.on('error', (err) => {
    console.error('BackEndSocket', err)
  })
})
frontEnd.on('error', (err) => {
  console.log(err)
})

frontEnd.listen(3000, '0.0.0.0', 1, () => {
  console.log('FrontEnd Server bound')
})
