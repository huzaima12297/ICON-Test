const url = require('url');

const {getAddressArray} = require('../Utils');
const {Controller} = require('./controller');
const {BASE_URL} = require('../Constants');

exports.RequestRoute = (req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === BASE_URL) {
    if (!reqUrl.query.address) {
      res.writeHead(400, {'Content-Type': 'text/html'});
      res.end('No Address Found');
      return;
    }
    const addresses = getAddressArray(reqUrl.query.address);
    Controller(req, res, addresses);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
};
