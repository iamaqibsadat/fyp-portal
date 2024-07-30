const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const socket = require('./socket');
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

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
