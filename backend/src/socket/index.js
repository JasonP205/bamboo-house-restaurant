import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middleware/socketMiddleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});
io.use(socketMiddleware);
io.on("connection",async (socket) => {
    console.log("Socket connected: " + socket.id);

    socket.on("joinBranchRoom", (branchId) => {
        socket.join(branchId);
        console.log(`Socket ${socket.id} joined branch room ${branchId}`);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected: " + socket.id);
    });
});


export {io, app, server}