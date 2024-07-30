const socketIO = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    // Initialize Socket.IO with CORS configuration
    io = socketIO(httpServer, {
      cors: {
        origin: 'https://fyp-portal-frontend.onrender.com',
        methods: ['GET', 'POST']
      }
    });

    // Optional: Set up event handlers here
    io.on('connection', (socket) => {
      console.log('a user connected');
      
      // Handle specific socket events here
      // Example: socket.on('event_name', (data) => { /* handle event */ });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
