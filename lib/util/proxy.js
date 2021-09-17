'use strict';

const http = require('http');

module.exports = function createProxySocket(proxy, target) {
  return new Promise((resolve, reject) => {
    const options = {
      host: proxy.host,
      port: proxy.port,
      method: 'CONNECT',
      path: target.host + ':' + target.port,
      headers: { Connection: 'Keep-Alive' },
    };

    if (proxy.timeout) {
      options.timeout = proxy.timeout;
    }

    const req = http.request(options);
    req.on('timeout', ()=>{
      console.log('APN: proxy request timeout. destroying...');
      req.destroy();
    });
    req.on('error', reject);
    req.on('connect', (res, socket, head) => {
      resolve(socket);
    });
    req.end();
  });
};
