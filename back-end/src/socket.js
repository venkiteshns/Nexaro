import jwt from 'jsonwebtoken';
import User from './models/userSchema.js';
import ngeohash from 'ngeohash';

let io;

const initSocket = (socketIo) => {
    io = socketIo;

    io.on('connection', async (socket) => {
        console.log(`User connected : ${socket.id}`);

        // Register disconnect for ALL users immediately — before any early returns
        socket.on('disconnect', () => {
            console.log(`User disconnected : ${socket.id}`);
        });

        try {
            // 1. Get token from socket handshake auth
            const token = socket.handshake.auth?.token;
            if (!token) {
                console.log(`Socket ${socket.id} — no token, skipping room join`);
                return;
            }

            // 2. Decode token → get _id and activeRole
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (decoded) {
                const userId = decoded._id
                socket.join(`user:${userId}`);
                console.log(`User ${userId} joined room`);
            }


            // 3. Only workers join a zone room — posters/admins stay as individual connections
            if (decoded.activeRole !== 'worker') {
                console.log(`${decoded.activeRole} ${socket.id} connected (no room)`);
                return;
            }

            // 4. Fetch worker's serviceArea from DB (verify activeRole in DB too)
            const user = await User.findOne({ _id: decoded._id, activeRole: 'worker' }).select('serviceArea');

            if (!user?.serviceArea?.coordinates?.length) {
                console.log(`Worker ${socket.id} — no serviceArea set, skipping room join`);
                return;
            }

            // 5. serviceArea.coordinates = [lng, lat] (GeoJSON order)
            const [lng, lat] = user.serviceArea.coordinates;
            const geohash = ngeohash.encode(lat, lng, 4); // precision 4 ≈ 40km zone

            // 6. Server joins the socket into the correct zone room
            socket.join(`zone:${geohash}`);
            console.log(`Worker ${socket.id} joined zone:${geohash}`);

        } catch (err) {
            console.log(`Socket auth error for ${socket.id}:`, err.message);
        }
    });
};

const getIo = () => {
    if (!io) throw Error("Socket.IO Not Initialized");
    return io;
};

export { initSocket, getIo };