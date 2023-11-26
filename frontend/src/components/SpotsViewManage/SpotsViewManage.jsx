//import { useParams, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { thunkGetCurrentUserSpots } from '../../store/spots';  //auto imported
import { useEffect } from 'react';

import SpotTile from '../SpotTile/SpotTile';

import { Link } from 'react-router-dom';
import './SpotsViewManage.css';

function SpotsViewManage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetCurrentUserSpots());
    }, [dispatch])

    //updated store shape
    const currentUserSpotsObj = useSelector(state => state.spots);
    const currentUserSpotsArr = Object.values(currentUserSpotsObj);

    //console.log('allSpotsObj', allSpotsObj);
    return (
        <>
            <div className="header-container">
                <h2>Manage Your Spots</h2>
                <Link to="/spots/new" className='new-spot'>Create a New Spot</Link>
            </div>
            {/* artwork.id here is unique, but gallery.id is the same */}
            {currentUserSpotsArr.map((spot) => (
                <SpotTile key={spot.id} spot={spot} type='manage-spots'/>
            ))}
        </>
    )
}

export default SpotsViewManage;
