// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
//removed useselectors
import { useDispatch } from "react-redux";
//-
//phase 4
import { useModal } from "../../context/Modal";
//-
//Removed in phase 4
//import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";

//----------------------------------------
//import css file
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  //removed in phase 4
  //const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  //added inphase 4
  const { closeModal } = useModal();


  //removed in phase 4
  //if (sessionUser) return <Redirect to="/" />;

  //On submit of the form, validate that the confirm password is the same as the password fields,

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      //then dispatch the signup thunk action with the form input values.
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      .then(closeModal)   //added in phase 4 while converting from Page to Modal
      .catch(async (res) => {
        //handle and display errors from the signup thunk action if there are any
        const data = await res.json();
        //
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }

    // confirm password is not the same as the password, display an error message for this.
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };


  //Render a form with controlled inputs for the new user's username, firstName, lastName, email, and password, and confirm password fields.
  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}


//Export the SignupFormPage component at the bottom of the file
export default SignupFormPage;
