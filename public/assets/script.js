
document.addEventListener("DOMContentLoaded",()=>{
    console.log("Content Loaded");
    start();
  })
  
      var socket = io();
      sendMsg=()=>{
  
  var input=document.getElementById("msgToSend").value;
  console.log("Sending "+input);
  socket.emit('chat message',input);
  
  
     }
  
     
  socket.on('chat message',(msg)=>{
    console.log(msg);
  var li=document.createElement("li");
  li.textContent=msg;
  var ul=document.getElementById("chatDisplay");
  ul.appendChild(li);
  
  })
  
  
  // ***********************************************************************
  
  var capturevideo=document.getElementById("captureVideo");
     var stop=document.getElementById("stop");
     var remote=document.getElementById("remote");
     var video2=document.getElementById("video2");
     var video=document.querySelector("video");
     let desc;
  
  
  stop.onclick=()=>{
   window.stream.getTracks().forEach((track)=>{
     track.stop();
   })
  }
  
  let pc=new RTCPeerConnection();
  
  console.log("new pc created");
  console.log(pc);
  
  
  pc.ontrack=(event)=>{
    console.log("Received track");
    console.log(event); 
    if(video2.srcObject) return ;
    console.log("Video 2 is set ______");
      video2.srcObject=event.streams[0];
  }
  
  
  start=()=>{
  let stream=navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
    window.stream=stream;
  stream.getTracks().forEach(track => {
    pc.addTrack(track,stream);
  });
  video.srcObject=stream;
    });
  
  }
  
  capturevideo.onclick=()=>{
  start();
  
    
  }
  
  // pc.onicecandidate=(candidate)=>{
  //   console.log("Ice Candidate");
  //   console.log(candidate);
  //   socket.emit('candidate',candidate);
  // };
  
  pc.onnegotiationneeded=()=>{
  
    
    console.log("Negotiation needed");
    pc.createOffer().then((e)=>{
    console.log("Offer Cretaed");
    console.log(e);
    pc.setLocalDescription(e).then(()=>{
      console.log("After Setting Local Description");
      console.log(pc);
      socket.emit('offer',e);
    })
  });
  
  
  
  }
  
  
  socket.on('offer',(offer)=>{
    console.log("Got Offer From Server");
    console.log(offer);
    
  
  
    pc.setRemoteDescription(offer).then(()=>{
  
      console.log("Remote Description Set");
      console.log(pc);
      let  stream= navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
        console.log("Stream?????");
      // console.log(stream);
        stream.getTracks().forEach((track)=>{
          pc.addTrack(track,stream);
        })
      })
      pc.createAnswer().then((e)=>{
  console.log("Answer Created");
  console.log(e);
        pc.setLocalDescription(e).then(()=>{
          console.log("Local Description Set");
          console.log(pc);
          console.log("Emitting the Answer");
          socket.emit('answer',e);
        })
      })
    })
  });
  
  socket.on('answer',(answer)=>{
    console.log("Answer Received");
    console.log(answer);
    console.log("Setting Remote Description as answer");
    console.log(pc);
  
    pc.setRemoteDescription(answer).then(()=>{
      console.log("Affter Setting Remote Description");
      console.log(pc);  
    }).catch((err)=>{
      console.log(err);
    });
  })
  
  // socket.on('candidate',(candidate)=>{
  // pc.addIceCandidate(candidate);
  // });
  
     
  
  
  
  
  