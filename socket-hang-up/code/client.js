const http = require('http')

const server = http.createServer((req, res) => {
})
if (false) server.listen(3000)

const keepAliveAgent = new http.Agent({ keepAlive: true })
const runAndDieAgent = new http.Agent({ keepAlive: false })

const call = () => {
  const start = +(new Date())

  return new Promise((ok, ko) => {
    // http.get('http://server:3000/', {keepAliveAgent: runAndDieAgent}, (resp) => {
    http.get('http://proxy:3000/', {keepAliveAgent: runAndDieAgent}, (resp) => {

      let data = ''

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        const end = +(new Date())
        const time = end - start
        return ok({data, time})})
    }).on('error', (err) => {
      const end = +(new Date())
      const time = end - start
      return ok({err, time})
    })
  })
}

const calls = Array(10).fill(0).map(() => call())
Promise.all(calls).then(l => {
  return l.reduce((p, c) => {
    if (c.err) {
      p.errs.push(c.err)
    }
    c.err ? p.ko++ : p.ok++
    c.err ? p.kotime += c.time : p.oktime += c.time

    return p
  },
    {ok: 0, ko: 0, oktime: 0, kotime: 0, errs: []}
  )
}).then(r => {
  r.kotime = r.kotime / (r.ko ? r.ko : 1)
  r.oktime = r.oktime / (r.ok ? r.ok : 1)
  console.log(r)
})
