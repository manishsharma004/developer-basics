const http = require('http')

const port = Number(process.env.PORT || 80)

http
  .createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello from myapp:1.0\n')
  })
  .listen(port, () => {
    console.log(`myapp listening on :${port}`)
  })
