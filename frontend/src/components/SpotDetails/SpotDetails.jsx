import { useParams } from 'react-router-dom';
import { thunkGetSpotDetails } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import './SpotDetails.css';
import { thunkGetReviewsBySpotId, thunkGetReviewsCurrentUser } from '../../store/reviews'; //auto imported

//for modal
import { useState, useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem.jsx';  //bonus phase: mind these 3 imports
import PostReviewModal from '../PostReviewModal/PostReviewModal.jsx';

//Delete buttom
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal.jsx';  //autoimported

function SpotDetails() {
    const { spotId } = useParams();
    console.log('spotId', spotId);
    //thunk here takes in the spotId, and gets that data
    const dispatch = useDispatch();

    //logic to determine if user is logged in or not
    const sessionUser = useSelector(state => state.session.user);
    //this runs on first render
    let loggedIn = false;  //not logged in by default
    if(sessionUser && Object.values(sessionUser).length > 0){
        loggedIn = true;
    } else {
        loggedIn = false;
    } //after this loggedIn is determined and put to use in the render
    console.log('loggedIn', loggedIn);
    //if you comment this back in , we will get an error when we go to SpotDetails while logged out
    if(loggedIn){
        console.log('sessionUser', sessionUser);
        console.log('sessionUser.id', sessionUser.id);
    }

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
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


    //inside SpotDetails component
    //dispatches again when spotId changes
    useEffect(() => {
        dispatch(thunkGetSpotDetails(spotId));
    }, [dispatch, spotId]);
    //useSelector to get the data
    const spotDetailsObj = useSelector (state => state.spots);
    //..

    //need useEffect logic before conditionals, or console will give an error message
    //logic to dispatch and receive reviews
    useEffect(() => {
        //thunk only has one argument, action creator uses two
        dispatch(thunkGetReviewsBySpotId(spotId));
    }, [dispatch, spotId]);


    useEffect(() => {
        dispatch(thunkGetReviewsCurrentUser());
    }, [dispatch]);


    //these reviews already tied to user
    //reviewCurrentUser contains reviews of the current user
    const reviewsCurrentUser = useSelector(state => state.reviews.byUser);

    //dispatch(thunkGetReviewsBySpotId(spotId))
    //reviewArr contains reviews of the current spot
    //array of review objects { spotId: , }
    const reviewsArr = useSelector(state => state.reviews.bySpot[parseInt(spotId)]);

    console.log('reviewsCurrentUser', reviewsCurrentUser);
    if(!reviewsCurrentUser) return null;

    console.log('reviewsArr', reviewsArr);
    if(reviewsArr === undefined) return null; //Check this for first render, because we check for reviewsArr.length in the render below

    //logic to creatte boolean, check if [reviewId] exists inside the keys
    let userReviewed = false;  //default is false - if review.id not in reviewcurrent User
    for(let review of reviewsArr){
        let reviewId = review.id;
        if(parseInt(reviewId) in reviewsCurrentUser){
            userReviewed = true;
        }
    }



    //Check here, so many checks...
    if(!spotDetailsObj || !spotDetailsObj[parseInt(spotId)] || !spotDetailsObj[parseInt(spotId)].Owner) return null;  //CHECK: we will use this in first render below
    console.log('spotDetailsObj', spotDetailsObj);
    console.log('spotDetailsObj[spotId].Owner.id', spotDetailsObj[parseInt(spotId)].Owner.id);
    const ownerId = spotDetailsObj[parseInt(spotId)].Owner.id;
    if(!ownerId) return null;
    //----
    //if(!sessionUser || !sessionUser.id) return null;


    //function
    const onClick = () => {
        alert('Feature coming soon');
    }
    const convertDate = (createdAt) => {
        const year = createdAt.slice(0, 4);
        const monthNumber = createdAt.slice(5, 7);
        let monthName = '';
        if (monthNumber === '01') monthName = 'January';
        else if (monthNumber === '02') monthName = 'February';
        else if (monthNumber === '04') monthName= 'April';
        else if (monthNumber === '05') monthName= 'May';
        else if (monthNumber === '06') monthName= 'June';
        else if (monthNumber === '07') monthName= 'July';
        else if (monthNumber === '08') monthName= 'August';
        else if (monthNumber === '09') monthName= 'September';
        else if (monthNumber === '10') monthName= 'October';
        else if (monthNumber === '11') monthName= 'November';
        else if (monthNumber === '12') monthName= 'December';
        else monthName= 'Invalid month';
        return `${monthName} ${year}`;
    }

    //key into the id
    const id = parseInt(spotId);
    const singleSpotDetail = spotDetailsObj[id];  //obj

    //comment back console.log to test
    //CHECKING HERE a single variable: for preventing error on reload
    if(!singleSpotDetail) return null;    //CHECK: if singleSpotDetail does not exist, the SpotDetails component does not display
    //if it exists we do things with it
    //console.log('singleSpotDetails', singleSpotDetail)

    const spotImagesArr = singleSpotDetail.SpotImages;
    if(!spotImagesArr) return null;    //CHECK
    //console.log('spotImagesArr', spotImagesArr); //good

    const ownerObj = singleSpotDetail.Owner;  //Owner: {}
    if(!ownerObj) return null;    //CHECK
    //console.log('ownerArr', ownerObj);

    //excluding the first element
    const spotImagesArr2 = spotImagesArr.slice(1);
    //console.log('spotImagesArr2', spotImagesArr2);

    //const spotImagesArr2 = spotImagesArr.slice(1);

    //singleSpotDetail should already exist here
    //check if ratingsReviewDislay exists just in case
    let ratingsReviewsDisplay = '';  //empty string is falsy, so check contition without !
    if (ratingsReviewsDisplay) return null;

    if (singleSpotDetail.numReviews === 1){  //3 spaces for gap
        ratingsReviewsDisplay = '   \u00B7 1 review';  //if one review, display singular review
    } else if (singleSpotDetail.numReviews === 0) {
        ratingsReviewsDisplay = '';  //if 0 reviews, dislay nothing
    } else {  //if it does not equal to 0 or
        ratingsReviewsDisplay = `   \u00B7 ${singleSpotDetail.numReviews} reviews`;
    }




    //most functionalty done
    //need to add reviews
    return (
        <>
            <main className="page-container">
                <div className="upper-container">
                    <h2>{singleSpotDetail.name}</h2>
                    <div>{singleSpotDetail.city}, {singleSpotDetail.state}, {singleSpotDetail.country}</div>
                </div>
                <div className="image-container">
                    <div className="left-image-container">
                        {/* we must use this variable array, because it's being checked in the component */}
                        <img src={spotImagesArr[0].url} height="404px"></img>
                    </div>
                    <div className="right-image-container">
                        {spotImagesArr2.map((spotImageObj) => (  //its map james... yikes
                            <div key={spotImageObj.id} className="right-side-img-div">
                                <img src={spotImageObj.url} height="200px" className="right-side-img"></img>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="middle-container">
                    <div className="middle-left-container">
                        <h3>Hosted by {ownerObj.firstName} {ownerObj.lastName}</h3>
                        <div id="description">{singleSpotDetail.description}</div>

                    </div>
                    <div className="reserve-box">
                        <div className="reserve-box-top">
                            <div className="price">${singleSpotDetail.price} <span id="night">night</span></div>

                            <div>
                                {/* If there are no reviews for the spot, the text, "New", should be next to the star icon instead. */}
                                <span>&#9733;{singleSpotDetail.numReviews === 0 ? 'New' : singleSpotDetail.avgRating }</span>
                                <span>{ratingsReviewsDisplay}</span>
                            </div>
                        </div>
                        <button className="reserve-box-bottom" onClick={onClick}>
                            Reserve
                        </button>
                    </div>
                </div>

                <div className="review-container">
                    <div className="review-container-top">
                        <span>&#9733;{singleSpotDetail.numReviews === 0 ? 'New' : singleSpotDetail.avgRating }</span>
                        <span>{ratingsReviewsDisplay}</span>
                    </div>
                </div>

                {/* inside SpotDetails.jsx */}
                <div className="post-review-button-container">
                    {!loggedIn || (loggedIn && ownerId === sessionUser.id) || (loggedIn && userReviewed) ?
                    <></> :
                    <div className="post-review-button">  {/* pass in props for spot.id */}
                        <OpenModalMenuItem
                        className="post-review-modal"
                        itemText="Post Your Review"
                        onItemClick={closeMenu}
                        modalComponent={<PostReviewModal spotId={parseInt(spotId)}/>}
                        />
                    </div>}
                </div>

                {/* To do later: Populate Reviews */}
                <div className="review">
                    {reviewsArr.length === 0 ? (
                        <div>Be the first to post a review!</div>
                    ) :
                    /* need to create new reference to trigger re-render */
                    reviewsArr.slice().reverse().map((review) => (
                        <div key={review.id} className='review'>
                            <div id="firstName">{review?.User?.firstName}</div>
                            <div id="date">{convertDate(review.createdAt)}</div>
                            <div id="review-text">{review.review}</div>
                            {loggedIn && sessionUser.id === review?.User?.id ?
                            <div className="delete-review-button">
                                <OpenModalMenuItem
                                className="delete-review-modal"
                                itemText="Delete"
                                onItemClick={closeMenu}
                                modalComponent={<DeleteReviewModal reviewId={parseInt(review.id)} spotId={parseInt(review.spotId)}/>}
                                />
                            </div>
                            :
                            null}
                        </div>
                    ))}
                </div>



            </main>

        </>
    )
}

export default SpotDetails;


//old code
/*  <span>{`\u00B7`}</span> */
/* <span>
{singleSpotDetail.numReviews === 1
    ? '\u00B7 1 review'
    : singleSpotDetail.numReviews === 0
    ? ''
    : `\u00B7 ${singleSpotDetail.numReviews} reviews`}
</span> */
