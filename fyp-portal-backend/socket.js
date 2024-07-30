const socketIO = require('socket.io');

let io;

module.exports = {
  /**
   * Initializes Socket.IO with the given HTTP server and CORS configuration.
   * @param {http.Server} httpServer - The HTTP server instance.
   * @returns {socketIO.Server} - The initialized Socket.IO server.
   */
  init: (httpServer) => {
    // Initialize Socket.IO with CORS configuration
    io = socketIO(httpServer, {
      cors: {
        origin: 'https://fyp-portal-frontend.onrender.com', // Frontend URL
        methods: ['GET', 'POST'],
        credentials: true, // Allow credentials if needed
      }
    });

    // Optional: Set up event handlers here
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Example of handling a custom event
      socket.on('exampleEvent', (data) => {
        console.log('Received exampleEvent with data:', data);
        // Handle the event here
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    return io;
  },

  /**
   * Returns the initialized Socket.IO instance.
   * @returns {socketIO.Server} - The Socket.IO server instance.
   * @throws {Error} - Throws an error if Socket.IO has not been initialized.
   */
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
