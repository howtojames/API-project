import { csrfFetch } from "./csrf.js";

const GET_REVIEWS_BY_SPOT_ID = 'reviews/getReviewsBySpotId';


//reviews is { Reviews: [ {}, {}, ...] }
//spotId is to to setup the store [spotId] inside bySpot
const getReviewsBySpotId = (reviews, spotId) => {
    return {
      type: GET_REVIEWS_BY_SPOT_ID,
      reviews: reviews,
      spotId: spotId
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
      console.log('reviews response obj', reviews);
      dispatch(getReviewsBySpotId(reviews, spotId));
      return reviews;
    } else  {
      console.log('/api/spots/:spotId/reviews error output');
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
    default:
      return state;
  }
};

export default reviewsReducer;
