import EventEmitter from 'events';
export default class MockWebSocket extends EventEmitter{
  send(msg){
    return msg;
  }
}
MockWebSocket.attachEvents=function(client){
  client.on('onopen',client.onopen)
  client.on('onmessage',client.onmessage)
}
