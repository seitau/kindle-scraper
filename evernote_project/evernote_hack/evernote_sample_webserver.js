const http = require('http');
const url = require('url');
const server = http.createServer();

server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
const url_parts = url.parse(req.url, true);
const query = url_parts.query;
  console.log(query)
 //   res.write(req);
    res.end();
});

// サーバを待ち受け状態にする
// 第1引数: ポート番号
// 第2引数: IPアドレス
server.listen(3000);
