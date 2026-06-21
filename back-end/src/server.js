import app from './app.js';
import { connectDB } from './config/db.js';
import http from 'http';
import { Server } from 'socket.io';
import { initSocket } from './socket.js';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
})

initSocket(io);

connectDB();

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port : ${process.env.PORT}`);
})

