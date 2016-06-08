import expect from 'expect';
import { HOCClient } from '../wsclient';
import MockWebSocket from "./MockWebSocket";

var WebSocketClient=HOCClient(MockWebSocket);
var client = new WebSocketClient();
MockWebSocket.attachEvents(client);
describe('WebSocket', function () {
  it('open connection', function () {
    client.emit('onopen');
    expect(client.open).toEqual(true)
  })
  it('receive message', function () {
    client.emit('onmessage',{message:"vimal"});
    expect(client.lastMessage).toEqual("vimal")
  })
  it('send message', function () {
    expect(client.send("a")).toEqual("a")
  })

});
