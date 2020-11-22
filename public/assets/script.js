
document.addEventListener("DOMContentLoaded", () => {
let state=document.getElementById("state");
state.innerText="Not Yet Connected";

let capturevideo = document.getElementById("captureVideo");
let stop = document.getElementById("stop");
let video2 = document.getElementById("video2");
let video = document.getElementById("video");
let negotiating;

let configuration = {
  'iceServers': [
    {
      'urls': 'stun:stun.l.google.com:19302'
    }
  ]
}
let pc = null;
var socket = io();
let room = "";
//console.log("new pc created");
//console.log(pc);

promptRoom = () => {
  room = window.prompt("Enter Room Number", "");
  return room;
}



createSendOffer=()=>{
  console.log("Create and Send Offer");
  pc.createOffer().then((e) => {
    // console.log("Offer Cretaed");
    // console.log(e);

    pc.setLocalDescription(e).then(() => {
      // console.log("After Setting Local Description");
      // console.log(pc);
      console.log("Local description set Not Ice candidate should start");
        socket.emit('offer', room,pc.localDescription);
      
    });

  }).catch((err)=>{
    console.log(err);
  });

}



getLocalStream=(stream)=>{
  stream.getTracks().forEach(track => {
    console.log("Adding tracks");
    pc.addTrack(track, stream);
  });
}


start = () => {
pc=new RTCPeerConnection(configuration);

pc.ontrack = (event) => {
  console.log("On track");
  console.log(event); 
  // if (video2.srcObject) return;
  console.log("Video 2 is set ______");
  video2.srcObject = event.streams[0];
}


pc.onicecandidate = (event) => {
  console.log("Ice Candidate");
  // console.log(event.candidate);
  let candidate=event.candidate;
  if(!candidate){
    console.log("All Candidates Generated ");
    console.log("****************");
return ;
  }
//Emit candidates when other person has joined the room
  socket.emit('candidate', room,candidate);

};


pc.onnegotiationneeded = () => {
  console.log("Negotiation needed");

if(negotiating){
  state.innerText="!!!!!Already Negotiating";
  console.log("!!!!!Already Negotiating");
  return ;
}

negotiating=true;
  // createSendOffer
// console.log(pc);
// pc.localDescription=null;
// pc.remoteDescription=null;
state.innerText="Negotiating,Share the Room ID to another User";
  createSendOffer();



}


pc.onconnectionstatechange=()=>{
  console.log("State");
  console.log(pc.connectionState);
  state.innerText=pc.connectionState;

  if(pc.connectionState==='disconnected'|| pc.connectionState==="failed"){
    console.log("Disconncted");
    negotiating=false;

    // video2.srcObject=null;
    // createSendOffer();
    // pc.close();
    // pc.localDescription=null;
    // pc.remoteDescription=null;

  }

}

//********************************* */
// room="";
  console.log("start");


state.innerText="Getting Stream from Camera";

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {

    // room = promptRoom();
    console.log(room + " room");

     while (room == null || room == "") {
      console.log("Enter Room no");
      room = promptRoom();
if(!room){
  window.alert("Empty Not Allowed");

}else{
  socket.emit("room", room);

}
    }


    


    getLocalStream(stream);

    video.srcObject = stream;
// window.stream=stream;


  }).catch((err) => {
    window.alert(err);
  });






}

start();

  console.log("Content Loaded");
  // if(navigator.mediaDevices){
  //   window.alert("Device Present");
  //   let result=navigator.mediaDevices.getUserMedia();
  //   window.alert(result);
  // }



sendMsg = (event) => {
  event.preventDefault();
  var input = document.getElementById("msgToSend");
  //console.log("Sending "+input.value);
  socket.emit('chat message', room, input.value);
  input.value = "";
  input.focus();
}


socket.on('chat message', (msg) => {
  //console.log(msg);
  var li = document.createElement("li");
  li.textContent = msg;
  li.classList.add("list-group-item");

  li.classList.add("list-group-item-success");
  li.classList.add("mb-2");



  var ul = document.getElementById("chatDisplay");
  ul.appendChild(li);

})


// ***********************************************************************
// let cands=[];

// pc.onicecandidate = (event) => {
//   console.log("Ice Candidate");
//   // console.log(event.candidate);
//   let candidate=event.candidate;
//   if(!candidate){
//     console.log("All Candidates Generated ");
//     console.log("****************");
// return ;
//   }
// //Emit candidates when other person has joined the room
//   socket.emit('candidate', room,candidate);

// };


// let negotiating;
// pc.onnegotiationneeded = () => {
//   console.log("Negotiation needed");

// if(negotiating){
//   state.innerText="!!!!!Already Negotiating";
//   console.log("!!!!!Already Negotiating");
//   return ;
// }

// negotiating=true;
//   // createSendOffer
// // console.log(pc);
// // pc.localDescription=null;
// // pc.remoteDescription=null;
// state.innerText="Negotiating,Share the Room ID to another User";
//   createSendOffer();



// }


// pc.onconnectionstatechange=()=>{
//   console.log("State");
//   console.log(pc.connectionState);
//   state.innerText=pc.connectionState;

//   if(pc.connectionState==='disconnected'|| pc.connectionState==="failed"){
//     console.log("Disconncted");
//     negotiating=false;

//     // video2.srcObject=null;
//     // createSendOffer();
//     // pc.close();
//     // pc.localDescription=null;
//     // pc.remoteDescription=null;

//   }

// }

socket.on("close",(flag)=>{
  console.log("Close Called");
  
  let stream=video.srcObject;
  state.innerText="Camera Stream Stopped";
  stream.getTracks().forEach((track) => {
  
    track.stop();

  });

  pc.close();
})

stop.onclick =async () => {
  negotiating=false;


//   let senders= await pc.getSenders();
//   console.log(senders);
//   senders.forEach((sender)=>{
// pc.removeTrack(sender);
//   });
//   pc.localDescription=null;
socket.emit("close",room);

  // socket.emit("leaveroom",room);

  // pc.close();

  // pc.removeTrack();
}




// pc.ontrack = (event) => {
//   console.log("On track");
//   console.log(event); 
//   // if (video2.srcObject) return;
//   console.log("Video 2 is set ______");
//   video2.srcObject = event.streams[0];
// }

socket.on("start",(flag)=>{
  start();

  // if(!negotiating){
  //   createSendOffer();

  // }

});

capturevideo.onclick = () => {
  socket.emit("start",room);
  // start();


}


socket.on("cantjoin", (msg) => {
  console.log(msg);
  window.alert(msg);
});

socket.on('offer', (offer) => {
  console.log("Got Offer From Server");
  // console.log(offer.sdp);

  // if(!pc.remoteDescription){
// console.log(pc);
// if(pc.connectionState==='closed'){
//   pc=new RTCPeerConnection();
// }
// console.log(pc);

  pc.setRemoteDescription(offer).then(() => { 

    console.log("Remote Description Set");
    // console.log(pc);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      // console.log("Stream?????");
      // //console.log(stream);4
      stream.getTracks().forEach((track) => {
        console.log("Addng tracks");
        pc.addTrack(track, stream);
      }); 

      pc.createAnswer().then((e) => {
        // console.log("Answer Created");
        // console.log(e);
        pc.setLocalDescription(e).then(() => {
          console.log("Local Description Set");
          // console.log(pc);
         
          console.log("Emitting the Answer");
  
          socket.emit('answer', room,pc.localDescription);
  
        });

      
      });
  

    });

    

  }).catch((err)=>{
    console.log(err);
  });


  
  // }else{
  //   console.log("Remote Description Already Set in offer Received");
  // }

});

socket.on('answer', (answer) => {
  console.log("Answer Received");
  // console.log(answer);
  // console.log("Setting Remote Description as answer");
  // console.log(pc);

// if(!pc.remoteDescription){
  pc.setRemoteDescription(answer).then(() => {
    console.log("Affter Setting Remote Description");

    // console.log(pc);  
  }).catch((err) => {
    //console.log(err);
  });
// }

  // }else{
  //   console.log("Remote Description Already Set in the Anser Received")
  // }
})

socket.on('candidate',  (candidate) => {
  console.log("Receibed from server canditate ");
  // console.log(candidate);
  if(pc.remoteDescription){
      pc.addIceCandidate(candidate);

  }else{
    console.log("Remote Description not set and you are adding ice candidates");
  }

  }
);

socket.on("twojoined",(val)=>{
  console.log("There are two people now");

  console.log(negotiating);
  if(!negotiating){
  createSendOffer();

  }

});





});
