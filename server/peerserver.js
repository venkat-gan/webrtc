import express from 'express';
import http from 'http';
import url from 'url';

/*
(TODO:Ravi)

*/
////////////////////////////////////////////////////////////////////////////*(TODO:ADD MIDDLEWARE)*//////////
export function createPeerServer(option,server){
  return function (socketServer){

      let{ send, eventHandlers } = socketServer(option);

      let {onMessage, onClose,onConnection} = eventHandlers();

      return{
          onMessage,
          onClose,
          onConnection
      }
  }
}


export function applyMiddleWare(...middleware){
    return (createServer)=>(server)=>{
      var {onMessage,onClose,onConnection} = createServer(server);

    }
}

////////////////////////////////////////////////////////////////////////////*(TODO:ADD MIDDLEWARE)*//////////




const peerserver = (option) => (socketServer) => {
      let{ send, onConnection } = socketServer(option);
      let {onMessage, onClose } = onConnection(handleConnection);
      onMessage(handleTransaction);
      onClose(handleClosingConnection);
  }

export function handleClosingConnection(peers,clientID){
    delete peers[clientID];
    return {
      peers: Object.assign({},peers)
    }
}



export function handleTransaction(transactionType,data,peers){
  try{
    let message = JSON.parse(data);
    if (['LEAVE', 'CANDIDATE', 'OFFER', 'ANSWER'].indexOf(message.type) !== -1) {
        let type = message.type;
        let src = message.id;
        let dst = message.dst;

        if(transactionType === 'DESTINATION_CLIENT_LEFT'){
            delete peers[dst];
            if(src){
              let payload = JSON.stringify( {
                type:'PEER_LEFT',
                dst: src
              });
              return {
                socket: peers[src].socket,
                payload,
                peers: Object.assign({},peers)
              }
            }
        };

        let destinationClient = peers[dst];
        if(destinationClient){
          let payload = JSON.stringify(message);

          return {
            peers,
            payload,
            socket: destinationClient.socket
          }
        };

        return {
          peers: Object.assign({},peers)
        };

    }else{
      // console.log('ERROR PeerServer: ', 'unrecognized message');
      return {
        peers
      }
    }
  }catch(e){
    throw e;
  }
}


export function handleConnection(query,socket,peers){
    let id = query.id;
    let coordinates = query.coordinates;

    if(!coordinates){
      return {
        peers,
        message: { type: 'ERROR', description:'Client need to provide the current coordinates'}
      };
    };

    id = id?id:generateUniqueID(peers);
    let client = peers[id]?peers[id]:{};
    client.socket = socket;
    client.coordinates = coordinates;
    let message = JSON.stringify({ type: 'OPEN', clientID: id});

    return{
      clientID: id,
      peers: Object.assign({},peers,{[id]:client}),
      message
    };

};


export function generateUniqueID (clients){
  let randomNumber = generateRandomID();
  while(clients[randomNumber]){
    randomNumber = generateRandomID();
  }
  return randomNumber;
};

export function generateRandomID(){
    return Math.floor(100000 + Math.random() * 900000);
};

export default peerserver;
