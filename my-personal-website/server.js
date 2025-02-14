const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('.');

const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url === '/' ? '/index.html' : req.url);
    filePath = path.normalize(filePath);

    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    const extname = path.extname(filePath);
    const contentTypeMap = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.md': 'text/plain',
        '.html': 'text/html',
    };

    const contentType = contentTypeMap[extname] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('500 Server Error');
            }
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
