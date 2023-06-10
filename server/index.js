/*IMPORT DEPENDENCIES*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/*IMPORT ROUTER*/
import usersRouter from "./router/userRouter.js";
import employeeRouter from "./router/employeeRouter.js";
import employeeTodoRouter from "./router/employeeTodoRouter.js";
import chatRouter from "./router/chatRouter.js";

/*IMPORT SOCKET*/
import {Server} from "socket.io";
import http from 'http';
import jwt from "jsonwebtoken";

/*CALL DEPENDENCIES*/
const app = express();

/*SERVER*/
const server = http.createServer(app);

/*Express*/
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cors());

/*DotEnv*/
dotenv.config();
const PORT = process.env.PORT;

/*Routers*/

app.use("/api/users", usersRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/employee-todo", employeeTodoRouter);
app.use("/api/chat", chatRouter)

/*SOCKET*/

const socketIo = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

socketIo.on("connection", (socket) => {
    socket.on("connectEmployee", async (data) => {

        const idEmployee = await jwt.verify(data, process.env.JWTPASSWORD);

        socketIo.emit("connectInviteEmployee", idEmployee.userId);
    })

    socket.on("join-todo", (room) => {
        socket.join(room)
    })

    socket.on("leave-room-todo", (room) => {
        socket.leave(room)
    })

    socket.on("join-chat", (room) => {
        socket.join(room)
    })

    socket.on("leave-room-chat", (room) => {
        socket.leave(room)
    })

    socket.on("new-todo", (data) => {
        socket.to(data.employeeId).emit("call-back-new-todo", {todo: data.todo})
    })

    socket.on("todo-complete", (data) => {
        socket.to(data.room).emit("change-todo-status", {todoId: data.todoId});
    })

    socket.on("new-message", (data) => {
        socket.to(data.roomId).emit("receive-new-message", {message: data.message})
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(PORT, () => console.log(`Server listening ${PORT} port`));
