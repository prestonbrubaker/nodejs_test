const express = require('express'); // Import Express framework for building web applications
const http = require('http'); // Import Node's built-in http module for creating HTTP server
const socketIo = require('socket.io'); // Import Socket.IO for real-time bidirectional event-based communication
const fs = require('fs'); // Import filesystem module for file operations

const app = express(); // Initialize a new Express application
const server = http.createServer(app); // Create an HTTP server that listens to server ports and responds back to the client
const io = socketIo(server); // Initialize a new instance of Socket.IO with the HTTP server

app.use(express.static(__dirname)); // Serve static files from the directory where the script is running

// Set up a route handler for HTTP GET requests to the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Send the index.html file in response to requests to the root URL
});

app.get('/rectangles', (req, res) => {
    res.sendFile(__dirname + '/rectangles.json');
});

// Helper function to read the rectangles file
async function readRectanglesFile() {
    try {
        const content = await fs.promises.readFile('rectangles.json', 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading rectangles file:', err);
        return []; // Return an empty array if there's an error (e.g., file not found)
    }
}

// Helper function to write to the rectangles file
async function writeRectanglesFile(rectangles) {
    try {
        await fs.promises.writeFile('rectangles.json', JSON.stringify(rectangles, null, 4));
    } catch (err) {
        console.error('Error writing to rectangles file:', err);
    }
}

// Listen for incoming Socket.IO connections
io.on('connection', (socket) => {
    // Get client's IP address
    const clientIp = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

    socket.on('chat message', (data) => {
        console.log("Received new chat:", data);
        // Add the IP address to the message data
        const messageData = { ...data, ip: clientIp };
        io.emit('chat message', messageData);

        // Read the chatlog.json file
        fs.readFile('chatlog.json', (err, content) => {
            if (err) { // Check for and handle any errors
                console.error(err);
                return;
            }
            let chatLog = JSON.parse(content); // Parse the file content
            chatLog.push(messageData); // Add the new message to the chat log

            // Write the updated chat log back to the file
            fs.writeFile('chatlog.json', JSON.stringify(chatLog, null, 4), (err) => {
                if (err) { // Check for and handle any errors
                    console.error(err);
                }
            });
        });
    });
    socket.on('new rectangle', async (data) => {
        console.log("Received new rectangle:", data);
        let rectangles = await readRectanglesFile();
        rectangles.push(data);
        await writeRectanglesFile(rectangles);
        io.emit('update rectangles', rectangles);
    });

});

const PORT = process.env.PORT || 58541; // Set the port for the server
// Start the server listening on the specified port
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`); // Log a message when the server starts
});
