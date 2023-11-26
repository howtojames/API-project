// frontend/src/App.jsx
// changed in phase 1

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
///----------------------------
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';  //added Outlet phase 1
//removed in phase 4
//import LoginFormPage from './components/LoginFormPage/LoginFormPage';  //added this for Component because we don't have index.js
//------------------------------
//removed in phase 4
//import SignupFormPage from './components/SignupFormPage/SignupFormPage';  //added in phase2, added the file because we don't have index.js
//------------------------------
import Navigation from './components/Navigation/Navigation';  //ProfileButton is inside Navigation Component, added in phase 3
//------------------------------
import * as sessionActions from './store/session';

//
import './App.css';
import SpotsView from './components/SpotsView/SpotsView';  //auto imported
import SpotDetails from './components/SpotDetails/SpotDetails';
import SpotForm from './components/SpotForm/SpotForm.jsx';

import SpotsViewManage from './components/SpotsViewManage/SpotsViewManage';
import SpotFormUpdate from './components/SpotFormUpdate/SpotFormUpdate.jsx';
//------
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);  //trackes whether user has be loaded or not, so App only loads if restoreUser is returned

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  //changed in phase 3
  return (
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && <Outlet />}
    </>
  );
}
//------

//added Layout in phase 1
//added SignUpFormPage in phase 2
//stayed same in phase 3
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsView />
      },
      // {
      //   path: '/login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: "/signup",
      //   element: <SignupFormPage />
      // }
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/:id/edit',
        element: <SpotFormUpdate />
      },
      {
        path: '/spots/new',
        element: <SpotForm />
      },
      {
        path: '/spots/current',
        element: <SpotsViewManage />
      }
    ]
  }
]);

//phase 0
function App() {
  return <RouterProvider router={router} />;
}

export default App;
