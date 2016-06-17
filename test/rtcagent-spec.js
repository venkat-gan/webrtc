import expect from 'expect';
import { rtcagent,PeerConnectionManager } from '../rtcagent';
import MockWebSocket from "./MockWebSocket";
var mockWebSocket=new MockWebSocket()
var mockPeerConnection=new MockWebSocket()
rtcagent(mockWebSocket,mockPeerConnection);
describe('RTCAgent', function () {
  it('RTCAgent message', function () {
    mockWebSocket.emit('onmessage',{message:{type:"CHILD_CHANGE",childIds:[1]}});
    expect(mockWebSocket.lastSend).toEqual({type:"position"})

  })

})
describe("PeerConnectionManager check",function(){
  it("create new peerConnection",function(){
    var i=0;
    var pm=PeerConnectionManager(()=>{  i++; return ()=>{ return i} });
    expect(pm("1")()).toEqual("1");
    expect(pm("1")()).toEqual("1");
    expect(pm("2")()).toEqual("2");
  });
})
