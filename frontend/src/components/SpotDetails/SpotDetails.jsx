import { useParams } from 'react-router-dom';
import { thunkGetSpotDetails } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import './SpotDetails.css';
import { thunkGetReviewsBySpotId } from '../../store/reviews'; //auto imported

function SpotDetails() {
    const { spotId } = useParams();
    console.log('spotId', spotId);
    //thunk here takes in the spotId, and gets that data
    const dispatch = useDispatch();

    //dispatches again when spotId changes
    useEffect(() => {
        dispatch(thunkGetSpotDetails(spotId));
    }, [dispatch, spotId]);
    //useSelector to get the data
    const spotDetailsObj = useSelector (state => state.spots);
    console.log('spotDetailsObj', spotDetailsObj);



    //need useEffect logic before conditionals, or console will give an error message
    //logic to dispatch and receive reviews
    useEffect(() => {
        //thunk only has one argument, action creator uses two
        dispatch(thunkGetReviewsBySpotId(spotId));
    }, [dispatch, spotId]);
    const reviewsArr = useSelector(state => state.reviews.bySpot[parseInt(spotId)]);
    console.log('reviewsArr', reviewsArr);
    if(reviewsArr === undefined) return null; //Check this for first render, because we check for reviewsArr.length in the render below


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

    //CHECKING HERE a single variable: for preventing error on reload
    if(!singleSpotDetail) return null;    //CHECK: if singleSpotDetail does not exist, the SpotDetails component does not display
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
                <h2>SpotDetails</h2>
                <div className="upper-container">
                    <div>{singleSpotDetail.name}</div>
                    <div>{singleSpotDetail.city}, {singleSpotDetail.state}, {singleSpotDetail.country}</div>
                </div>
                <div className="image-container">
                    <div className="left-image-container">
                        {/* we must use this variable array, because it's being checked in the component */}
                        <img src={spotImagesArr[0].url} height="400px"></img>
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
                        <div>{singleSpotDetail.description}</div>

                    </div>
                    <div className="reserve-box">
                        <div className="reserve-box-top">
                            <div className="night">${singleSpotDetail.price} night</div>
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

                {/* To do later: Populate Reviews */}
                <div className="review">
                    {reviewsArr.length === 0 ? (
                        <div>Be the first to post a review!</div>
                    ) :
                    reviewsArr.map((review) => (
                        <div key={review.id} className='review'>
                            <div className="firstName">{review.User.firstName}</div>
                            <div className="date">{convertDate(review.createdAt)}</div>
                            <div className="review-text">{review.review}</div>
                        </div>
                    ))}
                    {}
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
