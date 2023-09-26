// frontend/src/components/Navigation/ProfileButton.js
//added useEffect in phase 3
//added useRef in phase 3s
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

//bonus phase - moved here from Navigation
//removed and added OpenModalMenuItem in bonus phase
//import OpenModalButton from '../OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


// Create a React functional component called ProfileButton that will
// render a generic user profile icon of your choice from Font Awesome.

// ProfileButton component to show a user profile icon as a button
// and a list containing the session user's username,
// full name (by putting the user's firstName and lastName next to each other)
// and email and logout button
function ProfileButton({ user }) {
  const dispatch = useDispatch();
  //Phase 3 Part 2, for DropDown Menu
  //defaults to false indicating that the menu is hidden
  const [showMenu, setShowMenu] = useState(false);
  //To get the reference to the HTML element of the dropdown menu, you can use the useRef React hook.
  const ulRef = useRef(); //phase 3

  console.log('user', user);
  console.log('showMenu', showMenu);

  // If showMenu is false, nothing should happen.
  // If showMenu is true, then set the showMenu to true.
  // When the profile button is clicked, it should call openMenu.
  //--------------------------
  const openMenu = (e) => {
    e.stopPropagation(); //added
    // if (showMenu) return;
    // setShowMenu(true);
    //
    setShowMenu(!showMenu)
  };
  //--------------------------

  //phase 3
  // closeMenu.
  // When this function is called set the showMenu state variable
  // to false to trigger the dropdown menu to close.
  useEffect(() => {
    // When you click on the profile button, both debugger's in the openMenu and closeMenu functions will be triggered.
    // To prevent this behavior, the listener should only be added when showMenu changes to true
    if (!showMenu) return;  //debugger - phase 3

    const closeMenu = (e) => {
      //added in phase 3
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    //call the function on 'click'
    document.addEventListener('click', closeMenu);

    //The cleanup function for the useEffect should remove this event listener.
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]); //phase 3

  //phase bonus
  //!!!
  const closeMenu = () => setShowMenu(false);

  //Remember, the logout button should dispatch the logout action when clicked
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    //added in phase bonus
    closeMenu();
  };

  //toggle showMenu to true indicating that the menu should now be shown
  //if the showMenu state variable is false, then apply a className of "hidden" to the dropdown menu element
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  //removed <i className="fas fa-user-circle" />
  //Choose an icon that will represent the user profile button and
  //render it in the ProfileButton component.
  //When the ProfileButton is clicked, toggle showMenu to true indicating that the menu should now be shown.
  //openMenu only opens, but doens't close
  //bonus phase - added OpenModalButton for LoginFormModal and SignupFormModal
  //bonus phase - added onButtonClick={closeMenu}
  //Dan helped me made changes here
  return (
    <>
      <button onClick={(e)=> openMenu(e)}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

//import it into the Navigation component
export default ProfileButton;
