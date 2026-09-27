import jwt from 'jsonwebtoken';
import User from './models/userSchema.js';
import ngeohash from 'ngeohash';
import logger from './utils/logger.js';

let io;

const initSocket = (socketIo) => {
    io = socketIo;

    // Low-level: fires for every transport connection attempt
    io.engine.on('connection', (rawSocket) => {
        logger.info(`Engine connection from ${rawSocket.remoteAddress}`);
    });

    io.on('connection', async (socket) => {
        logger.info(`Socket connected : ${socket.id}`);

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected : ${socket.id}`);
        });

        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                logger.info(`Socket ${socket.id} — no token, skipping room join`);
                return;
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (decoded) {
                const userId = decoded._id;
                socket.join(`user:${userId}`);
                const role = decoded.activeRole || decoded.role;
                if (role && role !== 'admin') {
                    socket.join("all-users");
                }
                if (role) {
                    socket.join(`role:${role}`);
                }
                logger.info(`User ${userId} (${role}) joined rooms`);
            }

            if (decoded.activeRole !== 'worker') {
                return;
            }

            const user = await User.findOne({ _id: decoded._id, activeRole: 'worker' }).select('serviceArea');

            if (!user?.serviceArea?.coordinates?.length) {
                logger.info(`Worker ${socket.id} — no serviceArea set, skipping room join`);
                return;
            }

            const [lng, lat] = user.serviceArea.coordinates;
            const geohash = ngeohash.encode(lat, lng, 4); 
            
            socket.join(`zone:${geohash}`);
            logger.info(`Worker ${socket.id} joined zone:${geohash}`);

        } catch (err) {
            logger.warn(`Socket auth error for ${socket.id}: ${err.message}`);
        }
    });
};

const getIo = () => {
    if (!io) throw Error("Socket.IO Not Initialized");
    return io;
};

export { initSocket, getIo };