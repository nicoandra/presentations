const net = require('net')

const host = 'server'
const port = 3001
const timeout = 200

const socket = net.createConnection({host, port, timeout})
socket.on('ready', () => {

  setInterval(() => {
    socket.write(Buffer.from(':)'))}, 1000)
})
