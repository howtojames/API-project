//from ArtImageTile
import { Link } from 'react-router-dom';
import './SpotTile.css';
import '../../App.css';

//props
function SpotTile({ spot }){

     return (
        <div className='spot-tile hover-pointer' title={`${spot.name}`}>
            {/* <span className='tool-tip'>{spot.name}</span> */}
            {/* Links to /spots/:spotId */}
            <Link key={spot.id} to={`/spots/${spot.id}`} className='spot-link'>
                <img src={spot.previewImage} height="200px" className='image'/>
                <div className='tile-bottom'>
                    <div className='tile-bottom-left'>
                        <div>{spot.city}, {spot.state}</div>
                        <div>${spot.price} night</div>
                    </div>
                    <div className='tile-bottom-right'>&#9733;{spot.avgRating ? spot.avgRating : 'New'}</div>
                </div>
            </Link>
        </div>
     )
}

export default SpotTile;
