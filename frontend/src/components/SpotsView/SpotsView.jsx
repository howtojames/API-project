//import { useParams, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { thunkGetAllSpots } from '../../store/spots';  //auto imported
import { useEffect } from 'react';

import SpotTile from '../SpotTile/SpotTile';

import './SpotsView.css'

function SpotsView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])

    //updated store shape
    const allSpotsObj = useSelector(state => state.spots);
    const allSpotsArr = Object.values(allSpotsObj);

    //console.log('allSpotsObj', allSpotsObj);
    return (
        <div id="spots-view-container">
            {/* artwork.id here is unique, but gallery.id is the same */}
            {allSpotsArr.map((spot) => (

                <SpotTile key={spot.id} spot={spot} type='view-spots' className='spot-tile-component'/>

            ))}
        </div>
    )
}

export default SpotsView;
