export const HOCClient = ( WebSocket ) =>
  class Client extends WebSocket
  {
    constructor(){
      super();
      this.open=false;
      this.lastMessage=null;
    }
    onmessage(e){
      this.lastMessage=e.message;
    }
    onopen(){
      this.open=true
    }
}
