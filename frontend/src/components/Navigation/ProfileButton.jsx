// frontend/src/components/Navigation/ProfileButton.jsx
//updated in bonus phase optional

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem.jsx';  //bonus phase: mind these 3 imports
import LoginFormModal from '../LoginFormModal/LoginFormModal.jsx';
import SignupFormModal from '../SignupFormModal/SignupFormModal.jsx';

import { Link } from 'react-router-dom';

//on check list
import { useNavigate } from 'react-router-dom';

//monday copied
//Navigation.css includes styling for ProfileButton.jsx too
//try to use classes and ids for elements
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  //
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    //if showMenu is true, we have a closeMenu
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  //added in bonus optional
  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    //User Menu and Log out checklist
    navigate('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <i className="fa-solid fa-bars"></i> {/* from own kit */}
        <i className="fas fa-user-circle" /> {/* from old fontawesome link */}
      </button>
      <ul id="drop-down-menu-list" className={ulClassName} ref={ulRef}>
        {user ? (
          <>   {/* added based on wireframe*/}
            <li>Hello, {user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li className='manage-spots'>
              <Link to="/spots/current" className="link">Manage Spots</Link>
            </li>
            <li>
              <button onClick={logout} className='logout-button'>Log Out</button>
            </li>
          </>
        ) : (
          <div id="two-buttons">                              {/* removed nested li elements */}
            <OpenModalMenuItem          /* changeed in bonus optional */
              itemText="Log In"       /* changed in bonus optional */
              onItemClick={closeMenu}   /* changed to onItemClick in bonus phase */
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
