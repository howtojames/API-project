// frontend/src/components/SignupFormPage/SignupFormModal.jsx
// phase 2
// phase 4 modal change

import { useState } from 'react';
import { useDispatch } from 'react-redux'; //removed, useSelector
import { useModal } from '../../context/Modal';  //phase 4
//import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
//phase 4
import './SignupForm.css';

// ...



//You gotta delete the token to test the SignupFormPage
//Good Job
//Works
function SignupFormModal() {
  const dispatch = useDispatch();
  //const sessionUser = useSelector((state) => state.session.user);  //removed
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal(); //added in phase 4 Modal

  //removed in phase 4
  //if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
       .then(closeModal)   //added .then() here in phase 4 modal
       .catch(async (res) => {
        const data = await res.json();

        /* { errors: { email}} */
        console.log('SignupFormModal data', data);
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const determineDisable = () => {
    //when any one of these conditions meet, it skips over the any other checks
    if(!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length )
      return true;
    else if(username.length < 4) return true;
    else if(password.length < 6) return true;
  }

  return (
    <div className="sign-up-modal-container">
      <h3 id="sign-up">Sign Up</h3>
      {/* only two errors that will appear from backend, independent of each other*/}
      {errors.email && <p>{errors.email}</p>}
      {errors.username && <p>{errors.username}</p>}
      {/* only frontend error that will show */}
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        {/* moved to top */}
        <label>
          Username
        </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />


        <label>
          First Name
        </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        <label>
          Last Name
        </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        {errors.password && <p className="error-message">{errors.password}</p>}
        <label>
          Confirm Password
        </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

        {/* error message moved up */}
        <button type="submit" className="sign-up-button"
        disabled={determineDisable()}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;  //changed in phase 4
