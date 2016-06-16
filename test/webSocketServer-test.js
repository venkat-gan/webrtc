import expect from 'expect.js';
import {createWebsocketServer}  from './../server/webSocketServer';

describe('Websocket server specifications::',()=>{
  var webSocketServer;
  var testServer;
  var events;


  beforeEach(()=>{
    function stubSocketServer({path,server}){
        events = {};
        function on(eventName,cb){
          events[eventName]=cb;
        };

        function clearEvent(){
          events = {};
        }

        function emit(eventName,socket){
          events[eventName](socket);
        }

        return{
          on,
          events,
          emit,
          clearEvent
        };
    };
    testServer = new stubSocketServer({
      path: undefined,
      server:undefined
    });



  });

  it('should add connection event on giving a callback',()=>{
    let {send , onConnection} = createWebsocketServer()(testServer);
    let{onMessage, onClose} = onConnection(()=>{});
    expect(testServer.events['connection']).to.be.ok()
  });

  it('should add message and close event on giving callbacks after triggering the ',()=>{
    var  expectedEvents = {};
    let {send , onConnection} = createWebsocketServer()(testServer);
    let{onMessage, onClose} = onConnection((query,socket,clients)=>{return {
      clientID: 123456,
      clients: [],
      message: JSON.stringify({ type: 'OPEN', clientID: 123456})
    }});
    onMessage(()=>{});
    onClose(()=>{});

    testServer.emit('connection',{upgradeReq:{
      url:'?id=123456&coorrdinates=sample'
      },
      send:(message)=>{

      },
      on: (eventName,cb)=>{
        expectedEvents[eventName]= cb;
      }
    });

    expect(expectedEvents['message']).to.be.ok()
    expect(expectedEvents['close']).to.be.ok()
  });

  describe('Onconnection event specifications::',()=>{
    var expectedEvents;
    var sentMessages;
    var socketStub;
    beforeEach(()=>{
      expectedEvents = {};
      sentMessages = [];
      testServer.clearEvent() //clean up previous datas

      let {send , onConnection} = createWebsocketServer()(testServer);
      let{onMessage, onClose} = onConnection((query,socket,clients)=>{return {
        clientID: 123456,
        peers: [],
        message: JSON.stringify({ type: 'OPEN', clientID: 123456})
      }});
      onMessage(()=>{});
      onClose((clients,clientID)=>{
        return {
          peers:[],
          clientID: 111
        }
      });
      socketStub = {upgradeReq:{
        url:'?id=123456&coorrdinates=sample'
        },
        send:(message)=>{
          sentMessages.push(message);
        },
        on: (eventName,cb)=>{
          expectedEvents[eventName]= cb;
        }
      }
    });

    it('should send the appropriate message while opening connection',()=>{
      testServer.emit('connection',socketStub);
      expect(sentMessages.length).to.eql(1);
    });
  });

  describe('onMessage event specifications::',()=>{
    var expectedEvents;
    var sentMessages;
    var socketStub;
    beforeEach(()=>{
      expectedEvents = {};
      sentMessages = [];
      testServer.clearEvent() //clean up previous datas

      let {send , onConnection} = createWebsocketServer()(testServer);
      let{onMessage, onClose} = onConnection((query,socket,clients)=>{return {
        clientID: 123456,
        clients: [],
        message: JSON.stringify({ type: 'OPEN', clientID: 123456})
      }});
      onMessage((type,message,clients)=>{
          return {
            peers: [],
            payload:message,
            socket: socketStub
          }
      });
      onClose(()=>{});
      socketStub = {upgradeReq:{
        url:'?id=123456&coorrdinates=sample'
        },
        send:(message)=>{
          sentMessages.push(message);
        },
        on: (eventName,cb)=>{
          expectedEvents[eventName]= cb;
        },

        emit: (eventName,message)=>{
          expectedEvents[eventName](message);
        }
      }

    });

    it('should send the appropriate meesage to the destination connection',()=>{
      testServer.emit('connection',socketStub);
      socketStub.emit('message',{sample: "sample"});
      expect(sentMessages).to.eql([ '{"type":"OPEN","clientID":123456}', { sample: 'sample' } ]);
    });

  });
  describe('Onclose event specification:: ',()=>{
    var expectedEvents;
    var calledCloseCallback;
    var socketStub;
    var sentMessages;
    beforeEach(()=>{
      expectedEvents = {};
      sentMessages = [];
      testServer.clearEvent() //clean up previous datas

      let {send , onConnection} = createWebsocketServer()(testServer);
      let{onMessage, onClose} = onConnection((query,socket,clients)=>{return {
        clientID: 123456,
        clients: [],
        message: JSON.stringify({ type: 'OPEN', clientID: 123456})
      }});
      onMessage(()=>{});
      onClose(()=>{calledCloseCallback = true
        return {
          peers: []
        }
      });
      socketStub = {upgradeReq:{
        url:'?id=123456&coorrdinates=sample'
        },
        send:(message)=>{
          sentMessages.push(message);
        },
        on: (eventName,cb)=>{
          expectedEvents[eventName]= cb;
        },

        emit: (eventName,message)=>{
          if(message){
            expectedEvents[eventName](message);
          }else{
            expectedEvents[eventName]();
          }
        }
      }

    });

    it('should call the on close callback for this event',()=>{
      testServer.emit('connection',socketStub);
      socketStub.emit('close');
      expect(calledCloseCallback).to.be.ok();
    });
  });
});
