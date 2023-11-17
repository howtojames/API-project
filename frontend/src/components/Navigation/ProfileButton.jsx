// frontend/src/components/Navigation/ProfileButton.jsx
// phase 3

import { useState, useEffect, useRef } from 'react';  //reomoved and added back in phase 3
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

// frontend/src/components/Navigation/Navigation.jsx

// ...
import './Navigation.css';
// ...

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);  //phase 3
  const ulRef = useRef(); //phase 3


  //toggle showMenu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  //added in phase 3
  useEffect(() => {
    //we only want to document wide event listner is showMenu is close
    if (!showMenu) return;

    // phase 3, change showMenu to false only if the target of the click event does NOT contain the HTML element of the dropdown menu.
    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  //phase 3: moved from Navigation to ProfileButton
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  //added in phase 3
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    //{/* <i className="fas fa-user-circle" /> */}
    //{/* https://fontawesome.com/icons/user?f=classic&s=regular */}
    //{/* <i className="fa-regular fa-user"></i>  */} {/* changed to ClassName for react */}
  return (
    <>
      <button onClick={toggleMenu}>  {/* added and changed in phase 3 */}
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}> {/* <-- Attach it here, phase 3 */}
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
