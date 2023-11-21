//import { useParams, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { thunkGetAllSpots } from '../../store/spots';  //auto imported
import { useEffect } from 'react';

import SpotTile from '../SpotTile/SpotTile';

function SpotsView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])


    const allSpotsObj = useSelector(state => state.spots.allSpots);
    const allSpotsArr = Object.values(allSpotsObj);

    //console.log('allSpotsObj', allSpotsObj);
    return (
        <>
            <h2>SpotsView Component</h2>
            {/* artwork.id here is unique, but gallery.id is the same */}
            {allSpotsArr.map((spot) => (
                <SpotTile key={spot.id} spot={spot} />
            ))}
        </>
    )
}

export default SpotsView;
