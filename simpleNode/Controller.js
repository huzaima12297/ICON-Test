const {fetchTitle, getResponseHTML} = require('../Utils');

exports.Controller = (req, res, addresses) => {
  let results = [];
  let completedRequests = 0;

  addresses.forEach(async (address) => {
    const data = await fetchTitle(address);
    results.push(data);
    completedRequests++;

    if (completedRequests === addresses.length) {
      res.end(getResponseHTML(results, 'simple Node'));
    }
  });
};
