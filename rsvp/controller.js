const RSVP = require('rsvp');
const {getResponseHTML, fetchTitleRSVP} = require('../Utils');

exports.Controller = (req, res, addresses) => {
  let results = [];

  const promises = addresses.map(fetchTitleRSVP);

  RSVP.all(promises)
    .then((resolvedResults) => {
      results = resolvedResults;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(getResponseHTML(results, 'RSVP'));
    })
    .catch((error) => {
      console.error('Internal Server Error:', error);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
    });
};
