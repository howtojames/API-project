// frontend/src/App.jsx
// changed in phase 1

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
///----------------------------
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';  //added Outlet phase 1
import LoginFormPage from './components/LoginFormPage/LoginFormPage';  //added this for Component because we don't have index.js
//------------------------------
import SignupFormPage from './components/SignupFormPage/SignupFormPage';  //added in phase2, added the file because we don't have index.js
//------------------------------
import * as sessionActions from './store/session';

//------
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);  //trackes whether user has be loaded or not, so App only loads if restoreUser is returned

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      {isLoaded && <Outlet />}
    </>
  );
}
//------

//added Layout in phase 1
//added SignUpFormPage in phase 2
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: '/login',
        element: <LoginFormPage />
      },
      {
        path: "/signup",
        element: <SignupFormPage />
      }
    ]
  }
]);

//phase 0
function App() {
  return <RouterProvider router={router} />;
}

export default App;
