const express=require('express');
const path=require('path');
const app=express();

var socket=require('socket.io');
app.use(express.static(path.join(__dirname,'public')));

if(process.env.NODE_ENV==='production'){
    console.log("Its Production");


    app.get('*',(req,res)=>{
        //console.log("Sending Html File");
        res.sendFile(path.resolve(__dirname,"index.html"));
    })
}


// var server=


app.get('/',(req,res)=>{
    console.log("Sending Html File");
    // console.log(req);
    res.sendFile(path.resolve(__dirname,"index.html"));
})

let port=process.env.PORT || 5000;  

let server=app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
}); 

var io=socket(server);

let rooms=[];
io.on('connection',(socket)=>{
    //console.log("A user connected");
    // //console.log(socket);
    socket.on("room",(room)=>{
console.log(room);
// rooms.push(room);
socket.join(room);
    });

    
    socket.on('disconnect',()=>{
        console.log("User Disconnected");
    });

    socket.on('chat message',(id,msg)=>{
        console.log(msg +" msg");
        console.log(socket.rooms);
console.log(id+" id ");
        io.to(id).emit('chat message',msg);
    });


    socket.on('offer',(id,offer)=>{
        // //console.log("Got Offer");
        // //console.log(offer);
        // socket.broadcast.emit('offer',offer);
        socket.to(id).emit('offer',offer);

    });

    socket.on('answer',(id,answer)=>{
        // //console.log("Got Answer");
        // //console.log(answer);
        
        // socket.broadcast.emit('answer',answer);
        socket.to(id).emit('answer',answer);

    })

    // socket.on('candidate',(candidate)=>{
    //     //console.log("Cndidate Received on server now enitting");
    //     socket.broadcast.emit(candidate);
    // })
})
