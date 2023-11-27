import { csrfFetch } from "./csrf.js";

const GET_REVIEWS_BY_SPOT_ID = 'reviews/getReviewsBySpotId';
const GET_REVIEWS_CURRENT_USER = 'reviews/getReviewsCurrentUser';
const POST_A_REVIEW = 'review/postAReivew';
const DELETE_A_REVIEW = 'review/deleteAReview';


//reviews is { Reviews: [ {}, {}, ...] }
//spotId is to to setup the store [spotId] inside bySpot
const getReviewsBySpotId = (reviews, spotId) => {
    return {
      type: GET_REVIEWS_BY_SPOT_ID,
      reviews: reviews,
      spotId: spotId
    };
};

const getReviewsCurrentUser = (reviews) => {
  return {
    type: GET_REVIEWS_CURRENT_USER,
    reviews: reviews
  };
};

//takesin a review and the spotId
const postAReivew = (review, spotId) => {
  return {
    type: POST_A_REVIEW,
    review: review,
    spotId: spotId
  };
};

//need
const deleteAReivew = (review, reviewId) => {
  return {
    type: DELETE_A_REVIEW,
    review: review,
    reviewId: reviewId
  };
};




//useSpotId for the get route
export const thunkGetReviewsBySpotId = (spotId) => async (dispatch) => {
    // Method: GET
    // URL: /api/spots/:spotId/reviews
    // Body: none
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);  //fetch

    if(res.ok) {
      //{ Reviews: [ {}, {}, ...] }
      const reviews = await res.json();
      //console.log('reviews response obj', reviews);
      dispatch(getReviewsBySpotId(reviews, spotId));
      return reviews;
    } else  {
      console.log('/api/spots/:spotId/reviews error output');
    }
};


export const thunkGetReviewsCurrentUser = () => async (dispatch) => {
  // Method: GET
  // URL: /api/reviews/current
  // Body: none
  const res = await csrfFetch(`/api/reviews/current`);  //fetch

  if(res.ok) {
    //{ Reviews: [ {}, {}, ...] }, food
    const reviews = await res.json();
    console.log('reviews of current user response obj', reviews);
    dispatch(getReviewsCurrentUser(reviews));
    return reviews;
  } else  {
    console.log('/api/reviews/current error output');
  }
};

//need spotId to pass inside the route
export const thunkPostAReview = (review, spotId) => async (dispatch) => {
  //Create a Review for a Spot based on the Spot's id
  // Method: POST
  // URL: /api/spots/:spotId/reviews
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });

  if(res.ok) {
    // {} single object
    const review = await res.json();
    console.log('posted review obj', review);
    dispatch(postAReivew(review, spotId));
    return review;
  } else  {
    const error = await res.json();
    console.log('thunk PostAReview error', error);
    return error;
  }
};


export const thunkDeleteAReview = (reviewId) => async (dispatch) => {
  //Method: DELETE
  //URL: /api/reviews/:reviewId
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if(res.ok) {
    // { message: "successful deleted or review couldn't be found"} single object
    const review = await res.json();
    console.log('thunk deleteAReview response', review);
    dispatch(deleteAReivew(reviewId));
    return review;
  } else  {
    const error = await res.json();
    console.log('thunk deleteAReview error', error);
    return error;
  }
};






const initialState = { bySpot: {}, byUser: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOT_ID: {
      const newState = {...state,
        bySpot: {...state.bySpot, [action.spotId]: [...action.reviews.Reviews]} }; //look at the data passed back in the redcer, spready the Reviews array
      // action.reviews.Reviews.forEach((review) => newState.bySpot[action.spotId] = we're not populating objects here);
      return newState;
    }
    case GET_REVIEWS_CURRENT_USER: {
      const newState = { ...state };
      action.reviews.Reviews.forEach((review) => newState.byUser[review.id] = review);
      //console.log('xxxxxxxxnewState', newState);
      return newState;
    }
    // case POST_A_REVIEW: { //action has (review, spotId)
    //   console.log('POST A REVIEW reducer case action.review', action.review);
    //   console.log('POST A REVIEW reducer case oldState', state);
    //    const newState = { ...state,
    //     bySpot: {...state.bySpot,
    //                       //spreading array             , adding new object to the array
    //     [action.spotId]: [...state.bySpot[action.spotId], action.review]} };  //action.review is an object here, just adding it to the array, the other case might take care of it
    //     return newState;
    // }
    case DELETE_A_REVIEW: {
       //make a complete copy
       const newState = { ...state,
        bySpot: {...state.bySpot}, byUser: {...state.byUser} }
       delete newState.bySpot[action.reviewId];
       return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;


// Method: DELETE
// URL: /api/reviews/:reviewId
