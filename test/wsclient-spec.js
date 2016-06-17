import expect from 'expect';
import { webSocketClient } from '../wsclient';
import MockWebSocket from "./MockWebSocket";
var mockWebSocket=new MockWebSocket()
var client=webSocketClient(mockWebSocket);
//MockWebSocket.attachEvents(client);
describe('WebSocket', function () {
  it('receive message', function () {
    mockWebSocket.emit('onmessage',{message:{type:"ID",id:1}});
    expect(client.getId()).toEqual(1)
  })
  it('send message', function () {
    client.sendObject({a:1})
    expect({"a":1}).toEqual(mockWebSocket.lastSend)
  })

});
