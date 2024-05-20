const http = require('http');
const url = require('url');
const async = require('async');

const {BASE_URL} = require('./Constants');
const {getAddressArray, getResponseHTML} = require('./Utils');

const fetchTitle = (address, callback) => {
  callback(null, `${address}`);
};

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === BASE_URL) {
    if (!reqUrl.query.address) {
      res.end('No Address Found');
      return;
    }

    const addresses = getAddressArray(reqUrl.query.address);

    let results = [];
    const tasks = addresses.map((address) => {
      return (callback) => {
        fetchTitle(address, (err, title) => {
          if (err) {
            callback(err);
            return;
          }
          results.push(title);
          callback();
        });
      };
    });

    async.series(tasks, (err) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(getResponseHTML(results, 'async library'));
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
