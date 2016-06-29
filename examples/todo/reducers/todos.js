import { combineReducers } from 'redux';
import todo from './todo';

console.log(todo);

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    case 'TOGGLE_TODO':
      return Object.assign({},state,
                {[action.id]: todo(state[action.id], action)});
    default:
      return state;
  }
};


const allIds = (state = [],action) =>{
  switch (action.type) {
    case 'ADD_TODO':
      return [...state,action.id];
    default:
      return state;
  }
}

const todos = combineReducers({
  byId,
  allIds
});

const getAllTodos = (state) => state.allIds.map(id=>state.byId[id]);

export const getVisibleTodos = (state,filter) =>{
  const allTodos = getAllTodos(state);
  switch(filter){
    case 'SHOW_ALL':
      return allTodos;
    case 'SHOW_COMPLETED':
      return allTodos.filter((todo)=>todo.completed);
    case 'SHOW_ACTIVE':
      return allTodos.filter((todo)=>!todo.completed);
    default:
      throw new Error(`Unkown command: ${filter}`);
  }
};

export default todos
