// frontend/src/components/LoginFormModal/LoginFormModal.jsx
// changed to modal in phase 4, see instructions

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {

        const dataObj = await res.json();
        //console.log('data', dataObj);
        if (dataObj && dataObj.message) {
          //console.log('inside', dataObj);
          setErrors(dataObj);
        }
      });
  };

  //demouser
  const handleDemoUser = (e) => {
    e.preventDefault();
    setErrors({});
    //create demo user
    const demoUser = {
      credential: 'DemoUser',
      password: 'password123'
    };

    return dispatch(sessionActions.login(demoUser))
      .then(closeModal)
      .catch(async (res) => {
        const dataObj = await res.json();
        //console.log('data', dataObj);
        if (dataObj && dataObj.message) {
          //console.log('inside', dataObj);
          setErrors(dataObj);
        }
      });
  }

  //console.log('login errors state', errors);
  return (
    <>
    <div className='login-form-container'>
        <h3 id='log-in'>Log In</h3>
        {errors.message && <div className="error-message">{errors.message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />



          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />

        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        {/* disabled anytime the username is less than 4 characters or the password is less than 6 characters. */}
        <button type="submit" disabled={credential.length < 4 || password.length < 6}
          id="log-in-button">Log In</button>
        <button onClick={handleDemoUser} className="login-demo-user-button">Login in as Demo User</button>
      </form>
    </div>
    </>
  );
}

export default LoginFormModal;
