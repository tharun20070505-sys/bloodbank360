let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    // Client registers their user ID room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined room user_${userId}`);
      }
    });

    // Blood bank joins their dedicated room
    socket.on('join_bank', (bankId) => {
      if (bankId) {
        socket.join(`bank_${bankId}`);
        console.log(`🏥 Blood Bank ${bankId} joined room bank_${bankId}`);
      }
    });

    // Donors join emergency broadcast channel
    socket.on('join_emergency', () => {
      socket.join('emergency_broadcasts');
      console.log(`🚨 Socket ${socket.id} subscribed to emergency broadcasts`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return ioInstance;
};

const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

const broadcastEmergency = (requestData) => {
  if (ioInstance) {
    ioInstance.to('emergency_broadcasts').emit('emergency_blood_request', requestData);
  }
};

const broadcastToBank = (bankId, event, data) => {
  if (ioInstance && bankId) {
    ioInstance.to(`bank_${bankId}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  broadcastEmergency,
  broadcastToBank
};
