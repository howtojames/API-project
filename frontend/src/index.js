//phase 0

// frontend/src/index.js
import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';   //provider
import { BrowserRouter } from 'react-router-dom';   //router
import App from './App';   //App

import configureStore from './store';   //connect the store to React


//-------------------------------------------

//create a variable to access store on the window
const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

//-------------------------------------------

//Root functional component
//pass in the key of store with store's value
function Root() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
}

//-------------------------------------------

//render the Root functional component
ReactDOM.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
    document.getElementById('root'),
);
