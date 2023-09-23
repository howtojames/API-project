//changed in phase 4
// frontend/src/components/LoginFormModal/index.js

//phase 1
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
//removed in phase 4
//import { Redirect } from "react-router-dom";
//------------------------------------------

import "./LoginForm.css";

//------------------------------------------
//phase 4 - debugged
import { useModal } from "../../context/Modal";

///add a React functional component named LoginFormPage
//changed in phase 4
function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  //phase 4
  const { closeModal } = useModal();

  //If there is a current session user in the Redux store, then redirect the user to the "/" path if trying to access the LoginFormPage
  //if (sessionUser) return <Redirect to="/" />;
  //removed in phase 4

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)  //.then and .catch added in phase 4
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  //Render a form with a controlled input for
  //the user login credential (username or email) and a controlled input for the user password.
  //submit of the form, dispatch the login thunk action with the form input values
  //
  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">Log In</button>
      </form>
    </>
  );
}

//LoginFormPage component at the bottom of the file, then render it in App.js at the "/login" route.
export default LoginFormModal;
//changed in phase 4
