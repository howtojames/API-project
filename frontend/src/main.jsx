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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
