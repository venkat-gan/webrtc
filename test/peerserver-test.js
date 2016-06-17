import expect from 'expect.js';
import peerserver,{generateUniqueID,handleTransaction,handleClosingConnection,handleConnection} from './../server/peerserver';
import express from 'express';
import http from 'http';
import {Server as webSocketServer} from 'ws';
import WebSocket from 'ws';

describe('peerServer specifications::',()=>{
  var option;
  var server;
  var app;
  var websocket;
  var testSocketServer;
  var callbacks;

  beforeEach(()=>{
    // app = express();
    // server = http.createServer(app);
    //server.listen(8080,()=>{});
    testSocketServer = function(server){
      callbacks = [];
      function send(cb){
        callbacks.push(cb);
      }

      function onConnection(cb){
        callbacks.push(cb);
          return{
            onMessage:(cb)=>{callbacks.push(cb); },
            onClose: (cb)=>{callbacks.push(cb);}
          }
      }

      return {
        send,
        onConnection
      }
    }
  })

  afterEach(()=>{//Cleanup
    callbacks= [];
  })

  xit('should return a new instance ',()=>{
    var peer = new peerserver({},server);
    expect(peer).to.be.ok();
    peer.getSocket()
  });

  xit('should return a socket',()=>{
    var peer = new peerserver({},server);
    expect(peer.getSocket()).to.be.an(webSocketServer);
  });

  it('should Initialize a socket server', ()=>{
    var socketServer = peerserver(undefined,undefined);
    socketServer(testSocketServer);
  })

  it('should provide 3 callbacks', ()=>{
    var socketServer = peerserver(undefined,undefined);
    socketServer(testSocketServer);
    expect(callbacks.length).to.eql(3);
  });

  describe('Message transaction::',()=>{
    const src = 'srcSampleID';
    const dst = 'dstSampleID';

    it('should only accpet the recognized message types (LEAVE,CANDIDATE,OFFER,ANSWER) ',()=>{
      let data = {dst,id:src};
      const clients = {};
      clients[dst]={
           socket: 'sample'
      };
      let {socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(!socket).to.be(true);
      expect(clients === peers).to.be(true);
      expect(!payload).to.be(true);
    });

    it('should send the transaction to the appropriate destination',()=>{
      let data = {type:'CANDIDATE',dst,id:src};
      const clients = {};
      clients[dst]={
           socket: 'sample'
      };
      let {socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(socket === peers[dst].socket).to.be(true);
      expect(clients === peers).to.be(true);
      expect(payload === JSON.stringify(data)).to.be(true);
    });

    it('should remove the peer from the clients for DESTINATION_CLIENT_LEFT message type',()=>{
      let leaveMessage = JSON.stringify({type: 'LEAVE',id: src, dst})
      const clients = {};
      clients[dst]={
           socket: 'sample1'
      };
      clients[src]={
           socket: 'sample2'
      };
      let {socket,peers,payload} = handleTransaction("DESTINATION_CLIENT_LEFT",leaveMessage,clients);
      expect(socket).to.eql(peers[src].socket)
    });

    it('should deliver CANDIDATE message to the destination',()=>{
      let data = {type:'CANDIDATE',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver LEAVE message to the destination',()=>{
      let data = {type:'LEAVE',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver OFFER message to the destination',()=>{
      let data = {type:'OFFER',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });

    it('should deliver ANSWER message to the destination',()=>{
      let data = {type:'ANSWER',dst,id:src};
      const clients = {};
      clients[dst]={
        socket: 'sample'
      };
      let{socket,peers,payload} = handleTransaction("SEND_TO_DESTINATION",JSON.stringify(data),clients);
      expect(payload).to.eql(JSON.stringify(data));
    });
  });

  describe('Generating unique Id',()=>{
    it('should generate a 6 digit number', ()=>{
      const randomNumber = generateUniqueID({});
      expect(randomNumber<=999999).to.be(true);
    });

  });

  describe('Handling ClosingConnection::',()=>{
    const src = 'srcSampleID';
    const dst = 'dstSampleID';
    it('should remove the peer from client list while closing the connection',()=>{
       let clients = {};
       clients[dst]={
         socket: 'sample3',
       };
       let {peers} = handleClosingConnection(clients,dst);
       expect(peers).to.eql({});
    });
  });

  describe('Handling OnConnection',()=>{
    it('should send a message that socket is open along with the clientID',()=>{
        const query = { id: 111, coordinates: 'sample'};
        let clients = {};
        let{clientID,peers,message} = handleConnection(query,'sampleSocket',clients);
        expect(message).to.eql(JSON.stringify({type: 'OPEN', clientID: clientID}));
    });

    it('should return the socket for that particular client',()=>{
        const query = { id: 111, coordinates: 'sample'};
        let clients = {};
        let{clientID,peers,message} = handleConnection(query,'sampleSocket',clients);
        expect(clientID).to.be.a('number');
        expect(peers[clientID].coordinates).to.eql('sample');
    });
  });
});
