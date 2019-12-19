const dns = require('dns');
const dgram = require('dgram');
const DnsPacket = require('native-dns-packet');


// Pretend I'm a DNS server
const server = dgram.createSocket('udp4');
server.bind(53)

// Use myself as DNS resolver
// dns.setServers(['127.0.0.1'])

server.on('message', (msg, rinfo) => {
    // console.log(msg, rinfo)

    const packet = DnsPacket.parse(msg);
    packet.header.qr = 1    // Make the packet look like a response
    packet.header.rcode = 11;    // It is a failed response

    console.log(rinfo);

    const response = Buffer.from(msg);
    DnsPacket.write(response, packet);
    console.log(packet);
    console.log('Thanks for that DNS lookup. I will not resolve it. And you will error out');
    sendInvalidDnsResponse(response, rinfo.port);
});

const dnsCallback = (err, res) => {
    if(err) console.error(err);
    console.info(res)
}

server.on('listening', () => {
    console.info("The pretend-to-be DNS server is listening. ")
    dns.resolve('inexistenthost.inexistentdomain.tld', 'A', dnsCallback)
})

const sendInvalidDnsResponse = (msg, port) => {
    const packet = DnsPacket.parse(msg);
    
    const sender = dgram.createSocket('udp4');
    server.send(msg, port, '127.0.0.1', (err) => {
        if(!err) return
        console.error("Error when sending fake response", err)
    })
}

