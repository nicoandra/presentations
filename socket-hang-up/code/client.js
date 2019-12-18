const http = require('http')

const agent = new http.Agent({ 
  keepAlive: (process.env['HTTP_KEEPALIVE'] || 'false') === 'true',
  maxSockets: 2,
  timeout: 200
})

const REMOTE_HOST = process.env['REMOTE_HOST'] || 'server';
const ITERATIONS = parseInt(process.env['ITERATIONS'] || '1')

const call = (iteration) => {
  const start = +(new Date())

  let url = iteration;
  switch(iteration) {
    case 2:
      url = 'destroy'; break;
    case 3:
      url = 'end'; break;
    default:
    // none
  }

  return new Promise((ok, ko) => {
    http.get('http://' + REMOTE_HOST +':3000/' + url, { agent }, (resp) => {
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

const calls = Array(ITERATIONS).fill(0).map((v,x) => call(x))

console.log("Running", calls.length, "iterations");


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


setInterval(() => {

  const actualSockets = agent.sockets['server:3000:'] ? agent.sockets['server:3000:'].length : 0;
  const queuedRequests = agent.requests['server:3000:'] ? agent.requests['server:3000:'].length : 0;

  console.log({maxSockets: agent.maxSockets, queuedRequests, actualSockets})
}, 1000)