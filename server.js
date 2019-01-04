const { createServer } = require('http')
const next = require('next')
const { parse } = require('url')

const routes = require('./routes')

const app = next({
  dev: process.env.NODE_ENV !== 'production'
})

const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  createServer((req, res) => {
    console.log(req.url)
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write('User-agent: *\nSitemap: https://shici.xiange.tech/sitemap/site.xml')
      res.end()
    } else {
      handler(req, res)
    }
  }).listen(3000)
})
