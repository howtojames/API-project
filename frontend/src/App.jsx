// frontend/src/App.jsx
// changed in phase 1

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';  //added this for Component because we don't have index.js

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome!</h1>
  },
  {
    path: '/login',
    element: <LoginFormPage />
  }
]);

//phase 0
function App() {
  return <RouterProvider router={router} />;
}

export default App;
