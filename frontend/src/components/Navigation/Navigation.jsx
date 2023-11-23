// frontend/src/components/Navigation/Navigation.jsx
// everything refactored in bonus phase

import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';  //bonus phase copymind your imports
import './Navigation.css';


function Navigation({ isLoaded }) {
  //grabs the sessionUser after first render
  const sessionUser = useSelector(state => state.session.user);

  //this runs on first render
  let loggedIn = false;  //not logged in by default
  if(sessionUser && Object.values(sessionUser).length > 0){
    loggedIn = true;
  } else {
    loggedIn = false;
  } //after this loggedIn is determined and put to use in the render

  // console.log('sessionUser', sessionUser);
  // console.log('loggedIn', loggedIn);
  //Navigation css: added basic stylying to page
  return (
    <div id='navbar-container'>
      <div className="navbar-left">
        <NavLink id="site-title" to="/">Home-Bnb</NavLink>
      </div>
      {isLoaded && (
        <div className="navbar-right">
          {loggedIn && (
            <div className='create-a-new-spot'>
              <Link to="/spots/new" className='create-a-new-spot-link'>Create a New Spot</Link>
            </div>
          )}
          <div className="profile-button-container">
            <ProfileButton user={sessionUser} className="profile-button-hover"/>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
