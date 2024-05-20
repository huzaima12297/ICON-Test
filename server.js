const http = require('http');
const url = require('url');

const {BASE_URL} = require('./Constants');
const {getAddressArray, getResponseHTML} = require('./Utils');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === BASE_URL) {
    if (!reqUrl.query.address) {
      res.end('No Address Found');
      return;
    }

    const addresses = getAddressArray(reqUrl.query.address);

    let results = [];
    let completedRequests = 0;

    addresses.forEach((address) => {
      results.push(address);
      completedRequests++;

      if (completedRequests === addresses.length) {
        res.end(getResponseHTML(results, 'simple Node'));
      }
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
