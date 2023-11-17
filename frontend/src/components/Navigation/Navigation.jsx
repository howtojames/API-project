// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';  //removed useDispatch in phase 3
import ProfileButton from './ProfileButton';
//import * as sessionActions from '../../store/session';  //removed in phase 3

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  //const dispatch = useDispatch();  //removed in phase 3

  // logic moved to ProfileButton  //removed in phase 3
  //   const logout = (e) => {
  //     e.preventDefault();
  //     dispatch(sessionActions.logout());
  //   };

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      {/* <li>
        <button onClick={logout}>Log Out</button>
      </li> */}  {/* removed in phase 3 */}
    </>
  ) : (
    <>
      <li>
        <NavLink to="/login">Log In</NavLink>
      </li>
      <li>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    </>
  );

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
