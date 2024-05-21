const axios = require('axios');
const cheerio = require('cheerio');

exports.getAddressArray = (addresses) => {
  return Array.isArray(addresses) ? addresses : [addresses];
};

exports.getResponseHTML = (results, title) => {
  return `
  <html>
    <head></head>
    <body>
      <h1>Addresses using ${title}</h1>
      <ul>
        ${results
          .map((result) => `<li>${result.address} - ${result.title}</li>`)
          .join('')}
      </ul>
    </body>
  </html>
`;
};

exports.fetchTitle = async (address, callback) => {
  try {
    const url = address.startsWith('http') ? address : `http://${address}`;
    const response = await axios.get(url, {timeout: 5000});
    const html = response.data;
    const cheerioRes = cheerio.load(html);
    const title = cheerioRes('title').text();
    const titleRes = title ? title : 'NO RESPONSE';
    const tag = {address, title: titleRes};

    return callback ? callback(null, tag) : tag;
  } catch (error) {
    if (error.request) {
      const titleRes = 'NO RESPONSE';
      const tag = {address, title: titleRes};

      return callback ? callback(null, tag) : tag;
    }

    callback && callback(error);
    return `${address} - Error fetching the title`;
  }
};
