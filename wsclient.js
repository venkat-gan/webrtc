import EventEmitter from 'events';
import isEqual  from 'lodash/isEqual';
export const ID="ID",CHILD_CHANGE="CHILD_CHANGE",PARENT_CHANGE="PARENT_CHANGE";
export const webSocketClient = ( webSocket ) => {
  var id=null,
      childIds=[],
      parentId=null,
      listeners={
        [ID]:[],
        [CHILD_CHANGE]:[],
        [PARENT_CHANGE]:[]
      };

  const subscribe=(type,fn)=>{
    listeners[type].push(fn);
    return ()=>listeners[type].filter((listener)=>listener!=fn)
  }

  webSocket.onmessage=(e)=>{
    var msg=e.message;
    switch(msg.type){
      case ID:
        id=msg.id;
      break
      case CHILD_CHANGE:
          childIds=msg.childs;
      break;
      case PARENT_CHANGE:
        if(parentId != msg.parentId){
          parentId=msg.parentId;
        }
      break;
      default:
      return;
    }
    listeners[msg.type].forEach((listener)=>{
      listener()
    })
  }
  return {
    getChildId(){
      return childIds
    },
    getParentId(){
      return parentId;
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

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position)
  })
} else {
  /* geolocation IS NOT available */
}
