const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/rectangles', (req, res) => {
    res.sendFile(path.join(__dirname, 'rectangles.json'));
});

function readJsonFile(filePath, defaultContent) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return defaultContent;
    }
}

function writeJsonFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err);
    }
}

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (data) => {
        const chatLog = readJsonFile('chatlog.json', []);
        chatLog.push(data);
        writeJsonFile('chatlog.json', chatLog);

        io.emit('chat message', data);
    });

    socket.on('new rectangle', (data) => {
        const rectangles = readJsonFile('rectangles.json', []);
        rectangles.push(data);
        writeJsonFile('rectangles.json', rectangles);

        io.emit('update rectangles', rectangles);
    });
});

const PORT = process.env.PORT || 58541;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
