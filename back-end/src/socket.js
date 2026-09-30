import jwt from 'jsonwebtoken';
import User from './models/userSchema.js';
import ngeohash from 'ngeohash';
import logger from './utils/logger.js';

let io;

export const updateUserRoleAndZoneRooms = async (userId) => {
    if (!io) return;
    try {
        const user = await User.findById(userId).select('activeRole serviceArea');
        if (!user) return;

        const sockets = await io.in(`user:${userId}`).fetchSockets();
        if (!sockets || sockets.length === 0) {
            logger.info(`User ${userId} has no active socket connections to update rooms`);
            return;
        }

        for (const s of sockets) {
            // Leave old role rooms
            s.leave('role:poster');
            s.leave('role:worker');

            // Leave any old zone rooms
            for (const room of s.rooms) {
                if (room.startsWith('zone:')) {
                    s.leave(room);
                }
            }

            // Join new role room
            s.join(`role:${user.activeRole}`);

            if (user.activeRole === 'worker' && user.serviceArea?.coordinates?.length === 2) {
                const [lng, lat] = user.serviceArea.coordinates;
                const geohash = ngeohash.encode(lat, lng, 4);
                s.join(`zone:${geohash}`);
                logger.info(`User ${userId} switched role to worker: socket ${s.id} joined role:worker and zone:${geohash}`);
            } else {
                logger.info(`User ${userId} socket ${s.id} joined role:${user.activeRole}`);
            }
        }
    } catch (err) {
        logger.error(`Error updating user socket rooms for ${userId}: ${err.message}`);
    }
};

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

                // Query database to ensure fresh activeRole and serviceArea
                const user = await User.findById(userId).select('activeRole serviceArea');
                const role = user?.activeRole || decoded.activeRole || decoded.role;

                if (role && role !== 'admin') {
                    socket.join("all-users");
                }
                if (role) {
                    socket.join(`role:${role}`);
                }
                logger.info(`User ${userId} (${role}) joined rooms`);

                if (role === 'worker') {
                    if (!user?.serviceArea?.coordinates?.length) {
                        logger.info(`Worker ${socket.id} — no serviceArea set, skipping zone room join`);
                    } else {
                        const [lng, lat] = user.serviceArea.coordinates;
                        const geohash = ngeohash.encode(lat, lng, 4);
                        socket.join(`zone:${geohash}`);
                        logger.info(`Worker ${socket.id} joined zone:${geohash}`);
                    }
                }
            }
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