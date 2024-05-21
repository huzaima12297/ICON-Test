const axios = require('axios');
const cheerio = require('cheerio');
const RSVP = require('rsvp');

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

const getTag = async (address) => {
  const url = address.startsWith('http') ? address : `http://${address}`;
  const response = await axios.get(url, {timeout: 5000});
  const html = response.data;
  const cheerioRes = cheerio.load(html);
  const title = cheerioRes('title').text();
  const titleRes = title ? title : 'NO RESPONSE';
  const tag = {address, title: titleRes};
  return tag;
};

exports.fetchTitleNode = async (address) => {
  try {
    const tag = await getTag(address);
    return tag;
  } catch (error) {
    if (error.request) {
      const titleRes = 'NO RESPONSE';
      const tag = {address, title: titleRes};
      return tag;
    }

    return `${address} - Error fetching the title`;
  }
};

exports.fetchTitleAsync = async (address, callback) => {
  try {
    const tag = await getTag(address);
    callback(null, tag);
  } catch (error) {
    if (error.request) {
      const titleRes = 'NO RESPONSE';
      const tag = {address, title: titleRes};
      callback(null, tag);
      return;
    }

    callback(error);
  }
};

exports.fetchTitleRSVP = (address) => {
  return new RSVP.Promise((resolve, reject) => {
    getTag(address)
      .then((tag) => {
        resolve(tag);
      })
      .catch((error) => {
        if (error.request) {
          const titleRes = 'NO RESPONSE';
          const tag = {address, title: titleRes};
          resolve(tag);
        }
        reject(`${address} - Error fetching the title`);
      });
  });
};
