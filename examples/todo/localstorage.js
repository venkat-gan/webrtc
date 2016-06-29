export const loadState = ()=>{
  try{
    let state = localStorage.getItem('state');
    if(state === null){
      return undefined;
    }
    return JSON.parse(state);
  }catch(err){
    console.log(err)
    return undefined;
  }
}


export const saveState = (state) =>{
	try{
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state',serializedState);
    let sddstate = localStorage.getItem('state');
    console.log(sddstate);
	}catch(err){

  }
}
