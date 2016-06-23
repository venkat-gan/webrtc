import EventEmitter from 'events';
import isEqual  from 'lodash/isEqual';
export const OPEN="OPEN",PEER="PEER",OFFER="OFFER",ANSWER="ANSWER";
export const webSocketClient = ( webSocket ) => {
  var id=null,
      peerIds=[],
      offer={
        id:"-1",
        sdp:null
      },
      listeners={
        [OPEN]:[],
        [PEER]:[],
        [OFFER]:[],
        [ANSWER]:[]
      };

  const subscribe=(type,fn)=>{
    listeners[type].push(fn);
    return ()=>listeners[type].filter((listener)=>listener!=fn)
  }

  webSocket.onmessage=(e)=>{
    var msg=JSON.parse(e.data);
    console.log(msg)
    if(!msg) return;
    switch(msg.type){
      case OPEN:
        id=msg.clientID;
      break
      case PEER:
        peerIds=msg.peers;
      case OFFER:
        offer=msg.offer;
      break;
      case ANSWER:

      break;
      default:
      return;
    }
    listeners[msg.type].forEach((listener)=>{
      listener()
    })
  }
  return {
    getPeers(){
      return peerIds;
    },
    getOffer(){
      return offer;
    },
    getId(){
      return id
    },
    sendObject(ob){
      webSocket.send(JSON.stringify(ob))
    },
    subscribe
  }
}
export const getGeolocation=(navigator)=>(cb)=>{
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      cb(position)
    })
  } else {
    cb(null)
  }
}
