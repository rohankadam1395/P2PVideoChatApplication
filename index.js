const express=require('express');
const path=require('path');
const app=express();

var socket=require('socket.io');

if(process.env.NODE_ENV==='production'){
    console.log("Its Production");
    app.use(express.static(path.resolve(__dirname,'index.html')));
    app.use(express.static(path.resolve(__dirname,'socket.io')));

    app.get('*',(req,res)=>{
        console.log("Sending Html File");
        res.sendFile(path.resolve(__dirname,"index.html"));
    })
}


// var server=
app.get("/",(req,res)=>{
    res.send("hello there");
})
let port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
}); 

// var io=socket(server);


// io.on('connection',(socket)=>{
//     console.log("A user connected");
//     // console.log(socket);
//     socket.on('disconnect',()=>{
//         console.log("User Disconnected");
//     });
//     socket.on('chat message',(msg)=>{
//         console.log(msg);
//         io.emit('chat message',msg);
//     });


//     socket.on('offer',(offer)=>{
//         // console.log("Got Offer");
//         // console.log(offer);
//         socket.broadcast.emit('offer',offer);
//     });

//     socket.on('answer',(answer)=>{
//         // console.log("Got Answer");
//         // console.log(answer);
//         socket.broadcast.emit('answer',answer);
//     })

//     socket.on('candidate',(candidate)=>{
//         console.log("Cndidate Received on server now enitting");
//         socket.broadcast.emit(candidate);
//     })
// })
