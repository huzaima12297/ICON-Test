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

exports.fetchTitle = async (address) => {
  try {
    const url = address.startsWith('http') ? address : `http://${address}`;
    const response = await axios.get(url, {timeout: 5000});
    const html = response.data;
    const cheerioRes = cheerio.load(html);
    const title = cheerioRes('title').text();
    const titleRes = title ? title : 'NO RESPONSE';
    const tag = {address, title: titleRes};

    return tag;
  } catch (error) {
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      const titleRes = 'NO RESPONSE';
      const tag = {address, title: titleRes};

      return tag;
    } else {
      console.log('Request setup error:', error.message);
    }

    return `${address} - Error fetching the title`;
  }
};
