import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'
import {loadState, saveState} from './localstorage'
const persistedState = loadState()

let store = createStore(todoApp,persistedState);

store.subscribe(()=>{
  console.log(store.getState());
  saveState(store.getState());
});



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
