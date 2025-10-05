import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log('socket connected', socket.id);

      socket.on('join', roomId => {
        socket.join(roomId);
      });

      socket.on('message', ({ roomId, from, text }) => {
        const msg = { id: Date.now(), from, text, ts: new Date().toISOString() };
        io.to(roomId).emit('message', msg);
      });

      socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
      });
    });
  }
  res.end();
}
