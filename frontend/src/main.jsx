import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
// ... other imports
import { restoreCSRF, csrfFetch } from './store/csrf';
//phase 1
// ... other imports
import * as sessionActions from './store/session'; // <-- ADD THIS LINE
//phase 4
//Import the ModalProvider component in frontend/src/main.jsx and wrap your App with it:
//import the Modal component from the frontend/src/context/Modal.jsx file and render it as a sibling right under the App component.
import { ModalProvider, Modal } from './context/Modal';


const store = configureStore();
// ... const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  //phase 1
  window.sessionActions = sessionActions; // <-- ADD THIS LINE
}

//changed based on Dan's instructions
if (import.meta.env.MODE !== 'production') {
  window.store = store;
}

//phase 4, note the Context Provider is nested outside the store
//added modal
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
