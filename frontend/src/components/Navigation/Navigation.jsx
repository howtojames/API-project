// frontend/src/components/Navigation/Navigation.jsx
// everything refactored in bonus phase

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';  //bonus phase copymind your imports
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  //Navigation css: added basic stylying to page
  return (
    <ul id='navbar-container'>
      <li>
        <NavLink id="site-title" to="/">Home-Bnb</NavLink>
      </li>
      {isLoaded && (
        <li id="profile-button-container">
          <ProfileButton id="profile-button" user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
