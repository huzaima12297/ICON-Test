const async = require('async');
const {fetchTitle, getResponseHTML} = require('../Utils');

exports.Controller = (req, res, addresses) => {
  let results = [];

  const tasks = addresses.map((address) => {
    return (callback) => {
      fetchTitle(address, (err, tag) => {
        if (err) {
          callback(err);
        } else {
          results.push(tag);
          callback(null, tag);
        }
      });
    };
  });

  async.series(tasks, (err) => {
    if (err) {
      console.error('Internal Server Error:', err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(getResponseHTML(results, 'async library'));
    }
  });
};
