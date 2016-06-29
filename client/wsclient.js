import EventEmitter from 'events';
import isEqual  from 'lodash/isEqual';
export const OPEN="OPEN",PEER="PEER",OFFER="OFFER",ANSWER="ANSWER",CANDIDATE="CANDIDATE";
export const webSocketClient = ( webSocket ) => {
  var id=null,
      peerIds=[],
      offer={
        1: {
          id:"-1",
          sdp:null,
          candidate:null
        }
      },
      ans={
        id:1,
        sdp:null,
        candidate:null
      },
      listeners={
        [OPEN]:[],
        [PEER]:[],
        [OFFER]:[],
        [ANSWER]:[],
        [CANDIDATE]:[]
      };

  const subscribe=(type,fn)=>{
    listeners[type].push(fn);
    return ()=>listeners[type].filter((listener)=>listener!=fn)
  }

  webSocket.onmessage=(e)=>{
        console.log(e.data)
    var msg=JSON.parse(e.data);
    console.log("msg",msg.type)
    if(!msg) return;
    switch(msg.type){
      case OPEN:

        id=msg.clientID;
      break
      case PEER:
        peerIds=msg.childList;
        peerIds.forEach((peerId)=>{
          if(!offer[peerId]){
            offer[peerId]={
              id:peerId,
              sdp:null,
              candidate:null
            }
          }
        })
      case OFFER:
        offer[msg.src]=msg;
      break;
      case ANSWER:

      break;
      case CANDIDATE:

      break;
      default:
      return;
    }

    listeners[msg.type].forEach((listener)=>{
      console.log(msg)
      listener(msg)
    })
  }
  return {
    getPeers(){
      return peerIds;
    },
    getOffers(){
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
