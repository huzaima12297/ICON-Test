const http = require('http');
const {RequestRoute} = require('./simpleNode/routes');

const server = http.createServer(RequestRoute);

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
