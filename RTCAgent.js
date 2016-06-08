
import { wsSocket } from './wsclient';
createAgent(){
  var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var localConnection = new RTCPeerConnection();
  localConnection.onicecandidate = iceCallback1;
  var connect = function(){
    
  }
  var offer = function(){

  }

  return {
    connect
  }
}
/*AdapterJS.webRTCReady(function(isUsingPlugin ){
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    //var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    window.localConnection = new RTCPeerConnection();
    localConnection.onicecandidate = iceCallback1;
    window.sendChannel = localConnection.createDataChannel('sendDataChannel');
    console.log(localConnection.localDescription )
   // sendChannel.onopen = onSendChannelStateChange;
  //  sendChannel.onclose = onSendChannelStateChange;
   // sendChannel.onmessage = onReceiveMessageCallback;


  //  window.remoteConnection  = new RTCPeerConnection();
  //  remoteConnection.onicecandidate = iceCallback2;
  //  remoteConnection.ondatachannel = receiveChannelCallback;
    localConnection.createOffer().then(gotDescription1,onCreateSessionDescriptionError);

})*/

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  if (readyState === 'open') {
    console.log("open");
  } else {
    console.log("close");
  }
}
function onReceiveMessageCallback(event) {
  trace('Received Message');
  console.log( event.data);
}
function iceCallback1(event) {

  trace('local ice callback');
  if (event.candidate) {
      console.log("iceCallback1",event.candidate);
   /* remoteConnection.addIceCandidate(
      event.candidate
    ).then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
    trace('Local ICE candidate: \n' + event.candidate.candidate);*/
  }
}


function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function iceCallback2(event) {

  trace('remote ice callback');
  if (event.candidate) {
    localConnection.addIceCandidate(
      event.candidate
    ).then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
  }
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}
function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}
function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  trace('Offer from localConnection \n' + desc.sdp);
 // remoteConnection.setRemoteDescription(desc);
  //remoteConnection.createAnswer().then(gotDescription2,onCreateSessionDescriptionError);
}
function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  trace('Answer from remoteConnection \n' + desc.sdp);
  localConnection.setRemoteDescription(desc);
}


function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}
function onReceiveMessageCallback(event) {
  console.log(event.data);
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
}

function receiveChannelCallback(event) {

  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}
