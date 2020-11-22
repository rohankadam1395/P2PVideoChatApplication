const express = require('express');
const path = require('path');
const app = express();

var socket = require('socket.io');
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
    console.log("Its Production");


    app.get('*', (req, res) => {
        //console.log("Sending Html File");
        res.sendFile(path.resolve(__dirname, "index.html"));
    })
}


// var server=


app.get('/', (req, res) => {
    console.log("Sending Html File");
    // console.log(req);
    res.sendFile(path.resolve(__dirname, "index.html"));
})

let port = process.env.PORT || 5000;

let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

var io = socket(server);

let rooms = [];

roomFunc=(room,socket)=>{

    let count = 0;
    if (io.sockets.adapter.rooms[room]) {
        console.log(io.sockets.adapter.rooms[room].length);
        count = io.sockets.adapter.rooms[room].length;
        console.log("Count");
        console.log(count);
    }
    if (count < 2) {
        socket.join(room);
        if (count == 1) {
            console.log("Two people hae joined");
            io.to(room).emit("twojoined", true);
        }

    } else {
        socket.emit("cantjoin", "Room is Full");
    }
    console.log(room);
    // rooms.push(room);
}
io.on('connection', (socket) => {
    //console.log("A user connected");
    // //console.log(socket);

    socket.on("room", (room) => {
        roomFunc(room,socket);
    });

    socket.on("leaveroom", (room) => {
        console.log(io.sockets.adapter.rooms[room]);

        console.log("Leaving Room " + room);
        // console.log(socket.id);
        socket.leave(room);
        console.log(io.sockets.adapter.rooms[room]);

    });


    socket.on('disconnect', () => {
        console.log("User Disconnected");
    });

    socket.on("close", (id) => {
        console.log("Closing " + id);
        io.to(id).emit("close", true);
    });

    socket.on("start",(id)=>{
        console.log("Start Received");
    // roomFunc(id,socket);
        io.to(id).emit("start",true);
        
    });

    socket.on('chat message', (id, msg) => {
        console.log(msg + " msg");
        console.log(id + " id ");
        if (id) {
            console.log("Id is true");
            io.to(id).emit('chat message', msg);

        } else {
            console.log("Id is false");
            socket.emit("chat message", "Talking with yourself ? Join a room");
        }
    });


    socket.on('offer', (id, offer) => {
        // console.log("Got Offer");
        // console.log(offer);
        // socket.broadcast.emit('offer',offer);
        socket.to(id).emit('offer', offer);

    });

    socket.on('answer', (id, answer) => {
        // //console.log("Got Answer");
        // //console.log(answer);

        // socket.broadcast.emit('answer',answer);
        socket.to(id).emit('answer', answer);

    });

    // let cand=[];
    socket.on('candidate', (id, candidate) => {

        console.log("Cndidate Received on server now enitting");
        // socket.broadcast.emit(candidate);
        // console.log(candidate);
        // cand.push(candidate);   
        // console.log(cand.length);
        socket.to(id).emit('candidate', candidate);

    });
})
