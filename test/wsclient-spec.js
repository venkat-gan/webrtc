import expect from 'expect';
import { webSocketClient } from '../client/wsclient';
import MockWebSocket from "./MockWebSocket";
var mockWebSocket=new MockWebSocket()
var client=webSocketClient(mockWebSocket);
//MockWebSocket.attachEvents(client);
describe('WebSocket', function () {
  xit('receive message', function () {
    mockWebSocket.onmessage({data:{type:"OPEN",clientID:1}});
    expect(client.getId()).toEqual(1)
  })
  xit('send message', function () {
    client.sendObject({a:1});
    expect({"a":1}).toEqual(mockWebSocket.lastSend)
  })

});
