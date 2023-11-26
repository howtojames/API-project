//from ArtImageTile
import { Link } from 'react-router-dom';
import './SpotTile.css';

//for modal
import { useState, useEffect, useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem.jsx';  //bonus phase: mind these 3 imports
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal.jsx';

//import
//props
function SpotTile({ spot, type }){
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


    //  const onClick = (e) => {
    //     e.preventDefault();
    //  }

    //logic from ProfileButton
    useEffect(() => {
    if (!showMenu) return;

    //if showMenu is true, we have a closeMenu
    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);



    //added in bonus optional
    const closeMenu = () => setShowMenu(false);
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
                    <Link to={`/spots/${spot.id}/edit`} className='update'>Update</Link>
                    {/* <Link onClick={onClick} className='delete'>Delete</Link> */}
                    <div className="delete-button">  {/* pass in props for spot.id */}
                        <OpenModalMenuItem
                        className="delete-modal"
                        itemText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                        />
                    </div>
                </div>
            ) : null}

        </div>
     )
}

export default SpotTile;
