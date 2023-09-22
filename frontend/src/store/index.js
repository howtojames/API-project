// frontend/src/store/index.js
//phase 0
//isk applyMiddleWare, compose
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//---------------------------------------
//phase 1
import sessionReducer from "./session";

//create rootReducer
const rootReducer = combineReducers({
  session: sessionReducer,
});
//---------------------------------------

//enhancer should only apply the thunk middleware.
//development, the logger middleware and Redux dev tools compose enhancer as well
//re-read if you need more explaination
let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//---------------------------------------

//takes in a optional preloadedState
//configureStore function that takes in an optional preloadedState.
//Return createStore invoked with the rootReducer, the preloadedState, and the enhancer.
const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };


//used by index.js to attach the Redix store to the react applicaion
export default configureStore;
