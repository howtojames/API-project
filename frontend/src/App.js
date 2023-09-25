// frontend/src/App.js

//phase 1
//import React from "react"; //restore user

//removed in phase 4
//import LoginFormPage from "./components/LoginFormPage";
//------------------------------------------
//phase 1 - restore users
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
//removed Route in phase 4
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
//------------------------------------------
//phase 2
//renamed in phase 4
//import SignupFormModal from "./components/SignupFormModal";
//------------------------------------------
//phase 3
import Navigation from "./components/Navigation";


//then render App.js at the "/login" route.
function App() {

  //phase 1 - restore user
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  //added isLoaded in phase 1
  //added /signup in phase 2
  //added Navigation in phase 3
  //removed LoginFormPage in phase 4
  //remoed SignupFormpage Route
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
  </>
  );
}

//Export the SignupFormPage component at the bottom of the file,
//then render it in App.js at the "/signup" route.
export default App;
