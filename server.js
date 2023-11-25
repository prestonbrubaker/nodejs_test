const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const fs = require('fs');

// Serve static files from the current directory (including JavaScript files)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        const { msg, timestamp, ip } = data;
        const messageData = { msg, timestamp, ip };
        io.emit('chat message', messageData);

        // Append the message to the chatlog.json file
        fs.readFile('chatlog.json', (err, content) => {
            if (err) {
                console.error(err);
                return;
            }
            let chatLog = JSON.parse(content);
            chatLog.push(messageData);
            fs.writeFile('chatlog.json', JSON.stringify(chatLog, null, 4), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});




const PORT = process.env.PORT || 58541;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});