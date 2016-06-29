import { webSocketClient,getGeolocation,OPEN ,PEER,OFFER,ANSWER,CANDIDATE} from './wsclient';
import curry from 'lodash/curry';

export const rtcAgent = curry((navigator,WebSocket,RTCPeerConnection) => {
  var createOfferConnection=null;
  var createAnswerConnection=null;
  var webSocketClientObj=null;
  const locationMontior=getGeolocation(navigator);
  locationMontior(function(position){
    if(position){
      if(!webSocketClientObj){
        const webSocket = new WebSocket(`wss://localhost:9090/rtcserver?lat=${position.coords.latitude}&long=${position.coords.longitude}`)
        webSocketClientObj=new webSocketClient(webSocket);
      }
      else{
        webSocketClientObj.sendObject({type:"updatelocation",coords:{lat:position.coords.latitude,long:position.coords.longitude}});
      }
      var pm=PeerConnectionManager(RTCPeerConnection);
      webSocketClientObj.subscribe(OPEN,function(){
      })
      webSocketClientObj.subscribe(PEER,function(msg){
        console.log(msg,peerIds)
        var peerIds = webSocketClientObj.getPeers();
        console.log(msg,peerIds)
        peerIds.forEach((peerId)=>{
          var connection=pm(peerId);
          global.sendChannel=connection.createDataChannel('sendDataChannel',null);
          connection.createOffer().then(function(sdp) {
            connection.setLocalDescription(sdp,()=>{},(e)=>{console.log(e)});
            webSocketClientObj.sendObject({type:OFFER,src:webSocketClientObj.getId(),dst:peerId,sdp:sdp});
          },(e)=>{console.log(e)});

          sendChannel.onopen = ()=>{console.log("open")};
          sendChannel.onclose = ()=>{console.log("close")};

        })
      })
      webSocketClientObj.subscribe(OFFER,function(msg){
      //  var offer = webSocketClientObj.getOffers();
        var connection = pm(msg.src);
        connection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        connection.createAnswer().then(function(sdp) {
          connection.setLocalDescription(sdp,()=>{},(e)=>{console.log(e)});
          connection.ondatachannel = (e)=>{
            global.receiveChannel = event.channel;
             receiveChannel.onmessage = (msg)=>{
               console.log(msg);
             };
             receiveChannel.onopen = ()=>{console.log("r-open")};
             receiveChannel.onclose = ()=>{console.log("r-close")};
          }
          webSocketClientObj.sendObject({type:ANSWER,src:webSocketClientObj.getId(),dst:msg.src,sdp:sdp});
        },(e)=>{console.log(e)});

      })
      webSocketClientObj.subscribe(ANSWER,function(msg){
      //  var offer = webSocketClientObj.getOffers();
        var connection = pm(msg.src);
        connection.setRemoteDescription(new RTCSessionDescription(msg.sdp));

      })
      webSocketClientObj.subscribe(CANDIDATE,function(msg){
        console.log("CANDIDATE",msg)
        var connection = pm(msg.src);
        connection.addIceCandidate(new RTCIceCandidate(msg.candidate))
      })
      function PeerConnectionManager(RTCPeerConnection){
        var peerConnections={};
        return (id)=>{
          if(!peerConnections[id]){
            console.log(id);
              peerConnections[id]=new RTCPeerConnection(null,null)
          }
          else{
            console.log("old")
          }
          peerConnections[id].onicecandidate = function (evt) {
            if(evt.candidate )
             webSocketClientObj.sendObject({ type:CANDIDATE, candidate:evt.candidate,src:webSocketClientObj.getId(),dst:id });
         };
         console.log(peerConnections[id].onicecandidate)
          return peerConnections[id];
        }
      }

    }
  })
})


/*
var agent=new webClient(new WebSocket('url'));
function caller(){
  var id = agent.getId();

  AdapterJS.webRTCReady(function(isUsingPlugin ){
      var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
      var localConnection = new RTCPeerConnection();
      localConnection.onicecandidate = function iceCallback1(event) {
        if (event.candidate) {
            agent.send({type:"CANDIDATE",candidate:event.candidate});
        }
      }
      localConnection.createOffer().then(function(desc) {
          localConnection.setLocalDescription(desc);
          agent.send({type:"OFFER",sdp:desc});
      },onError);
}
Callee(){
  var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
  var localConnection = new RTCPeerConnection();
  localConnection.onicecandidate = function iceCallback1(event) {
    if (event.candidate) {
        agent.send({type:"CANDIDATE",candidate:event.candidate});
    }
  }
  localConnection.createOffer().then(function(desc) {
      localConnection.setLocalDescription(desc);
      agent.send({type:"OFFER",sdp:desc});
  },onError);
}
AdapterJS.webRTCReady(function(isUsingPlugin ){
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    var localConnection = new RTCPeerConnection();
    localConnection.onicecandidate = function iceCallback1(event) {
      if (event.candidate) {
          agent.send({type:"CANDIDATE",candidate:event.candidate});
      }
    }
    localConnection.createOffer().then(function(desc) {
        localConnection.setLocalDescription(desc);
        agent.send({type:"OFFER",sdp:desc});
    },onError);

    // sendChannel.onopen = onSendChannelStateChange;
   //  sendChannel.onclose = onSendChannelStateChange;
    // sendChannel.onmessage = onReceiveMessageCallback;


   //  window.remoteConnection  = new RTCPeerConnection();
   //  remoteConnection.onicecandidate = iceCallback2;
   //  remoteConnection.ondatachannel = receiveChannelCallback;
   /* remoteConnection.addIceCandidate(
      event.candidate
    ).then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
    trace('Local ICE candidate: \n' + event.candidate.candidate);

})


var signalingChannel = createSignalingChannel();
var pc;
var configuration = ...;

// run start(true) to initiate a call
function start(isCaller) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteView.src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        selfView.src = URL.createObjectURL(stream);
        pc.addStream(stream);

        if (isCaller)
            pc.createOffer(gotDescription);
        else
            pc.createAnswer(pc.remoteDescription, gotDescription);

        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            signalingChannel.send(JSON.stringify({ "sdp": desc }));
        }
    });
}

signalingChannel.onmessage = function (evt) {
    if (!pc)
        start(false);

    var signal = JSON.parse(evt.data);
    if (signal.sdp)
        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    else
        pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
};
*/
