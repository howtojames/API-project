// frontend/src/components/Navigation/ProfileButton.jsx
// phase 3

//import { useState } from 'react';  //removed in phase 3 to npm run build
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

// frontend/src/components/Navigation/Navigation.jsx

// ...
import './Navigation.css';
// ...

function ProfileButton({ user }) {
  const dispatch = useDispatch();

  //phase 3: moved from Navigation to ProfileButton
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button>
        {/* <i className="fas fa-user-circle" /> */}
        {/* https://fontawesome.com/icons/user?f=classic&s=regular */}
        <i className="fa-regular fa-user"></i>  {/* changed to ClassName for react */}
      </button>
      <ul className="profile-dropdown">
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
