import { useParams } from 'react-router-dom';
import { thunkGetSpotDetails } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';


function SpotDetails() {
    const { spotId } = useParams();
    console.log('spotId', spotId);
    //thunk here takes in the spotId, and gets that data
    const dispatch = useDispatch();

    //dispatches again when spotId changes
    useEffect(() => {
        dispatch(thunkGetSpotDetails(spotId));
    }, [dispatch, spotId]);

    //function
    const onClick = () => {
        alert('Feature coming soon');
    }

    //useSelector to get the data
    const spotDetailsObj = useSelector (state => state.spots);
    console.log('spotDetailsObj', spotDetailsObj);

    //key into the id
    const id = parseInt(spotId);
    const singleSpotDetail = spotDetailsObj[id];  //obj

    //CHECKING HERE a single variable: for preventing error on reload
    if(!singleSpotDetail) return null;    //CHECK
    //if it exists we do things with it
    console.log('singleSpotDetails', singleSpotDetail)

    const spotImagesArr = singleSpotDetail.SpotImages;
    if(!spotImagesArr) return null;    //CHECK
    console.log('spotImagesArr', spotImagesArr); //good

    const ownerObj = singleSpotDetail.Owner;  //Owner: {}
    if(!ownerObj) return null;    //CHECK
    console.log('ownerArr', ownerObj);

    //excluding the first element
    const spotImagesArr2 = spotImagesArr.slice(1);
    console.log('spotImagesArr2', spotImagesArr2);

    //const spotImagesArr2 = spotImagesArr.slice(1);

    //most functionalty done
    //need to add reviews
    return (
        <>
            <h2>SpotDetails</h2>
            <div className="upper-container">
                <div>{singleSpotDetail.name}</div>
                <div>{singleSpotDetail.city}, {singleSpotDetail.state}, {singleSpotDetail.country}</div>
            </div>
            <div className="left-image-container">
                {/* we must use this variable array, because it's being checked in the component */}
                <img src={spotImagesArr[0].url} height="300px"></img>
            </div>
            <div className="right-image-container">
                {spotImagesArr2.map((spotImageObj) => (  //its map james... yikes
                    <div key={spotImageObj.id}>
                        <img src={spotImageObj.url} height="300px"></img>
                    </div>
                ))}
            </div>
            <div>Hosted by {ownerObj.firstName} {ownerObj.lastName}</div>
            <div>{singleSpotDetail.description}</div>
            <div>{singleSpotDetail.avgRating}</div>


            <div>
                <div>${singleSpotDetail.price} night</div>
                <button onClick={onClick}>Reserve</button>
            </div>

        </>
    )
}

export default SpotDetails;
