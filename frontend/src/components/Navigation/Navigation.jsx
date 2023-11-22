// frontend/src/components/Navigation/Navigation.jsx
// everything refactored in bonus phase

import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';  //bonus phase copymind your imports
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  //Navigation css: added basic stylying to page
  return (
    <div id='navbar-container'>
      <div className="navbar-left">
        <NavLink id="site-title" to="/">Home-Bnb</NavLink>
      </div>
      {isLoaded && (
        <div className="navbar-right">
          <div className='create-a-new-spot'>
            <Link to="/spots/new" className='create-a-new-spot-link'>Create a New Spot</Link>
          </div>
          <div className="profile-button-container">
            <ProfileButton user={sessionUser} className="profile-button-hover"/>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
