// frontend/src/App.js

//phase 1
//import React from "react"; //restore user
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";

//------------------------------------------
//phase 1
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";

//------------------------------------------


//then render App.js at the "/login" route.
function App() {

  //phase 1 - restore user
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <Switch>
        <Route path="/login">
          <LoginFormPage />
        </Route>
      </Switch>
    )
  );
}

export default App;
