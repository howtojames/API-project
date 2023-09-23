// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
//----------------------------------------------------
//phase 3
import './Navigation.css';
//----------------------------------------------------
//phase 4
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  //phase 3
  //Render the ProfileButton component only when there is a session user.
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        <button onClick={logout}>Log Out</button>
      </li>
    );
  } else {
    //replaced Navlink in phase 4
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <NavLink to="/signup" className='nav-link'>Sign Up</NavLink>
      </li>
    );
  }
  //phase 3
  //added className to Navlink

  //Your navigation should render an unordered list with a navigation link to the home page.
  //It should only contain navigation links to the login and signup routes when there is no session user and a logout button when there is.
  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
