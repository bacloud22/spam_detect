const http = require('http')
const axios = require('axios')
const requestIp = require('request-ip')

const hostname = '127.0.0.1'
const port = 3000
const base = 3 // seconds
const round = (seconds) => Math.floor(seconds / base) * base;
const cache = {}

const server = http.createServer((req, res) => {
    var t1 = new Date()
    t1.setMilliseconds(0)
    t1.setSeconds(round(t1.getSeconds()))
    const clientIp = requestIp.getClientIp(req);
    console.log(`request ip ${clientIp}`)
    if( cache[clientIp] ) {
        // (cache[clientIp].at(-1) !== t1)
        if(cache[clientIp][cache[clientIp].length - 1].getTime() !== t1.getTime()) {
            cache[clientIp].push(t1)
        }
    } else {
        cache[clientIp] = [t1]
    }
    console.log(cache)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World')
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

axios
    .get(`http://127.0.0.1:3000/`)
    .then(res => res.data)
    .catch(error => console.log(error))