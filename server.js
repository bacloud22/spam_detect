const http = require('http')
const axios = require('axios')
const requestIp = require('request-ip')
const { deepStrictEqual } = require('assert')

const hostname = '127.0.0.1'
const port = 3000
// in seconds
const rules = {
    minDuration: 3600, // one hour
    base: 3
}
const round = (seconds) => Math.floor(seconds / rules.base) * rules.base;
const cache = {}
function detect(timeSerie) {
    // TODO: I don't know how
    // Detect range cycles ? (always after rules.minDuration)
    // Detect events happening daily on same time
    // What could be the trends of a bot ?
}

const server = http.createServer((req, res) => {
    var t1 = new Date()
    t1.setMilliseconds(0)
    t1.setSeconds(round(t1.getSeconds()))
    const client = requestIp.getClientIp(req)+'::'+req.headers['user-agent'];
    if (cache[client]) {
        // (cache[client].at(-1) !== t1)
        if (cache[client][cache[client].length - 1].getTime() !== t1.getTime()) {
            cache[client].push(t1)
        }
    } else {
        cache[client] = [t1]
    }
    console.log(cache)
    detect(cache[client])
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