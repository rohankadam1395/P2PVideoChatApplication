
  let capturevideo=document.getElementById("captureVideo");
  let stop=document.getElementById("stop");
  let remote=document.getElementById("remote");
  let video2=document.getElementById("video2");
  let video=document.getElementById("video");
  let desc;
  let pc=new RTCPeerConnection();

  console.log("new pc created");
  console.log(pc);


  start=()=>{
    console.log("start"); 
  navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
    window.stream=stream;
    console.log(stream);
  stream.getTracks().forEach(track => {
    pc.addTrack(track,stream);
  });
  console.log(video);
  video.srcObject=stream;
    });
  
  }
  
document.addEventListener("DOMContentLoaded",()=>{
  console.log("Content Loaded");
  start();
});

  
     var socket = io();
      sendMsg=(event)=>{
  event.preventDefault();
  var input=document.getElementById("msgToSend");
  console.log("Sending "+input.value);
  socket.emit('chat message',input.value);
  input.value="";
  input.focus();
     }
  
     
  socket.on('chat message',(msg)=>{
    console.log(msg);
  var li=document.createElement("li");
  li.textContent=msg;
  var ul=document.getElementById("chatDisplay");
  ul.appendChild(li);
  
  })
  
  
  // ***********************************************************************
  
  
  
  stop.onclick=()=>{
   window.stream.getTracks().forEach((track)=>{
     track.stop();
   })
  }
  
  
  
  
  pc.ontrack=(event)=>{
    console.log("Received track");
    console.log(event); 
    if(video2.srcObject) return ;
    console.log("Video 2 is set ______");
      video2.srcObject=event.streams[0];
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
  
     
  
  
  
  