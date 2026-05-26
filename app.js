const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // 目标服务器配置
  const targetHost = '47.253.206.60';
  const targetPort = 6185;
  const targetPath = req.url;

  const options = {
    hostname: targetHost,
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: targetHost }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxyReq);
});

server.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
