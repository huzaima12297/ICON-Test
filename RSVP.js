const http = require('http');
const url = require('url');
const RSVP = require('rsvp');

const {BASE_URL} = require('./Constants');
const {getAddressArray, getResponseHTML} = require('./Utils');

const fetchTitle = (address) => {
  return new RSVP.Promise((resolve, reject) => {
    resolve(`${address}`);
  });
};

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === BASE_URL) {
    if (!reqUrl.query.address) {
      res.end('No Address Found');
      return;
    }

    const addresses = getAddressArray(reqUrl.query.address);
    const promises = addresses.map(fetchTitle);

    RSVP.all(promises)
      .then((results) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(getResponseHTML(results, 'RSVP library'));
      })
      .catch((error) => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
