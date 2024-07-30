const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socket = require('./socket');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3001;

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socket.init(server);

// Set up Socket.IO connection and event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle client disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle custom 'message' event
  socket.on('message', (message) => {
    io.emit('message', message);
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'fyp-portal-frontend/build')));

// Catch-all route to serve index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fyp-portal-frontend/build', 'index.html'));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
