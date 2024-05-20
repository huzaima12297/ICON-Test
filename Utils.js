const {TAG_LIST} = require('./Constants');

exports.getAddressArray = (addresses) => {
  return Array.isArray(addresses) ? addresses : [addresses];
};

exports.getResponseHTML = (results, title) => {
  const newResults = results.map((address) => {
    const tagObject = TAG_LIST.find((tag) => tag.address === address);
    const tag = tagObject ? tagObject.tag : ' NO RESPONSE';
    return {address, tag};
  });

  return `
  <html>
    <head></head>
    <body>
      <h1>Addresses using ${title}</h1>
      <ul>
        ${newResults
          .map((result) => `<li>${result.address} - ${result.tag}</li>`)
          .join('')}
      </ul>
    </body>
  </html>
`;
};
