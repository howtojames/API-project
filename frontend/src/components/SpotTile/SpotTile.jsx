//from ArtImageTile
import { Link } from 'react-router-dom';
import './SpotTile.css';


//props
function SpotTile({ spot, type }){

    //console.log('spot', spot);
     return (
        <div className='spot-tile' title={`${spot.name}`}>
            {/* <span className='tool-tip'>{spot.name}</span> */}
            {/* Links to /spots/:spotId */}
            {/* hovers because we are inside a Link */}
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
            {type === 'manage-spots' ? (
                <div className='update-delete-container'>
                    <Link className='update'>Update</Link>
                    <Link className='delete'>Delete</Link>
                </div>
            ) : null}

        </div>
     )
}

export default SpotTile;
