// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';  //removed useDispatch in phase 3
import ProfileButton from './ProfileButton';
//import * as sessionActions from '../../store/session';  //removed in phase 3
//added in phase 4
import OpenModalButton from '../OpenModalButton/OpenModalButton';  //added the file path
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal'; //added in phase 4
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  //const dispatch = useDispatch();  //removed in phase 3

  // logic moved to ProfileButton  //removed in phase 3
  //   const logout = (e) => {
  //     e.preventDefault();
  //     dispatch(sessionActions.logout());
  //   };

  //copied from phase 4
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
