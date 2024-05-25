const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

let totalBytesSent = 0;

// Middleware to track bytes sent
app.use((req, res, next) => {
    let bytesSent = 0;

    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = function (chunk, encoding, callback) {
        if (chunk) {
            bytesSent += Buffer.byteLength(chunk, encoding);
        }
        return originalWrite.call(res, chunk, encoding, callback);
    };

    res.end = function (chunk, encoding, callback) {
        if (chunk) {
            bytesSent += Buffer.byteLength(chunk, encoding);
        }
        totalBytesSent += bytesSent;
        console.log(`Bytes sent for this request: ${bytesSent}`);
        console.log(`Total bytes sent so far: ${totalBytesSent}`);
        return originalEnd.call(res, chunk, encoding, callback);
    };

    next();
});

app.get('/video', (req, res) => {
    const videoPath = path.join(__dirname, 'video.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        console.log("range wise");
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return;
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        console.log("at a time");
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
