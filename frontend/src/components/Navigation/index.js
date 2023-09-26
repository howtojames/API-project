// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
//removed useDispatch in phase 4 Modal
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
//removed in phase 4 from Page to Modal
//import * as sessionActions from '../../store/session';
//----------------------------------------------------
//phase 3
import './Navigation.css';
//----------------------------------------------------
//phase 4
//import OpenModalButton from "../OpenModalButton";
//import LoginFormModal from "../LoginFormModal";
//added in phase 4 Modal
//import SignupFormModal from "../SignupFormModal";
//removed all in bonus phase

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  //removed useDispatch in phase 4 Modal
  //const dispatch = useDispatch();

  //removed in phase 4 Modal
  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  // };

  //phase 3
  //Render the ProfileButton component only when there is a session user.
  //phase 4 Modal
  //removed  <button onClick={logout}>Log Out</button>, after ProfileButton
  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   //replaced Navlink in phase 4
  //   //replaced Navlink in phase 4 Signup Form Modal
  //   //<NavLink to="/signup" className='nav-link'>Sign Up</NavLink>
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }
  //phase 3
  //added className to Navlink
  //all removed in phase 5

  //Your navigation should render an unordered list with a navigation link to the home page.
  //It should only contain navigation links to the login and signup routes when there is no session user and a logout button when there is.
  return (
    <ul>
      <li>
        <NavLink id="site-title" exact to="/">aA-Bnb</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}
//bonus phase - replaced session links with
//<li>
//<ProfileButton user={sessionUser} />
//</li>

export default Navigation;
