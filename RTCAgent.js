import { webSocketClient } from './wsclient';
import curry from 'lodash/curry';
export const rtcagent = curry((webSocket,RTCPeerConnection) => {
  var createOfferConnection=null;
  var createAnswerConnection=null;
  var webSocketClientObj=new webSocketClient(webSocket);
  var pm=PeerConnectionManager(RTCPeerConnection);
  webSocketClientObj.subscribe('ID',function(msg){
    webSocketClientObj.sendObject({type:"position"});
  })
  webSocketClientObj.subscribe('CHILD_CHANGE',function(msg){
    webSocketClientObj.sendObject({type:"position"});
  })
})

export function PeerConnectionManager(RTCPeerConnection){
  var peerConnections={};
  return (id)=>{
    if(!peerConnections[id]){
        peerConnections[id]=new RTCPeerConnection()
    }
    return peerConnections[id];
  }
}

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
