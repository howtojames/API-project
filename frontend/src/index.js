//phase 0
// frontend/src/index.js
import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';   //provider
import { BrowserRouter } from 'react-router-dom';   //router
//phase 4
import { ModalProvider, Modal } from "./context/Modal";
import App from './App';   //App

import configureStore from './store';   //connect the store to React
//---------------------------------------------
// ... other imports
// phase 0 part 2
import { restoreCSRF, csrfFetch } from './store/csrf';
//---------------------------------------------
// phase 1
//import from session.js
import * as sessionActions from "./store/session";

//---------------------------------------------





//-------------------------------------------
// phase 1
//create a variable to access store on the window
const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  //-------------
  restoreCSRF();   //added here, phase 0 part 2

  window.csrfFetch = csrfFetch;  //added here, phase 0 part 2
  //-------------
  window.store = store;
  //-------------
  //phase 1s
  window.sessionActions = sessionActions;
}

//-------------------------------------------

//Root functional component
//pass in the key of store with store's value
//phase 4 - wrapped the Modal Provider around the Provider
//phase 4 - added modal
function Root() {
    return (
      <ModalProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <Modal />
          </BrowserRouter>
        </Provider>
      </ModalProvider>
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
