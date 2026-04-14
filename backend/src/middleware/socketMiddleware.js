export const socketMiddleware = (socket, next) => {
    try {
        const deviceId = socket.handshake.query.deviceId;
        const branchId = socket.handshake.query.branchId;
        if (!deviceId) {
            return next(new Error('Missing device ID'));
        }
        socket.deviceId = deviceId;
        socket.branchId = branchId;
        next();
    } catch (error) {
        console.error('Socket middleware error:', error);
        next(new Error('Socket middleware error'));
    }
}