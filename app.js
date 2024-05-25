const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve the DASH manifest file
app.get('/video.mpd', (req, res) => {
    console.log("called for mpd");
    const filePath = path.join(__dirname, 'video', 'video.mpd');
    res.sendFile(filePath);
});

// Serve the DASH segment files
app.get('/video/:segment', (req, res) => {
    console.log("called segment");
    const segment = req.params.segment;
    const filePath = path.join(__dirname, 'video', segment);
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
