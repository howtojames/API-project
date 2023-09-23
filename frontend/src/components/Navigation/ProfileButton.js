// frontend/src/components/Navigation/ProfileButton.js
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';


// Create a React functional component called ProfileButton that will
// render a generic user profile icon of your choice from Font Awesome.

// ProfileButton component to show a user profile icon as a button
// and a list containing the session user's username,
// full name (by putting the user's firstName and lastName next to each other)
// and email and logout button
function ProfileButton({ user }) {
  const dispatch = useDispatch();

  //Remember, the logout button should dispatch the logout action when clicked
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown";

  //removed <i className="fas fa-user-circle" />
  //Choose an icon that will represent the user profile button and
  //render it in the ProfileButton component.
  return (
    <>
      <button>
        <i class="fa-regular fa-user"></i>
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

//import it into the Navigation component
export default ProfileButton;
