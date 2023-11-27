import { csrfFetch } from "./csrf.js";

const LOAD_ALL_SPOTS = "spots/loadAllSpots";
//get a single spot
const GET_SPOT_DETAILS = "spots/getSpotDetails"
const POST_A_SPOT = 'spots/postASpot';
const POST_A_SPOT_IMAGE = 'spots/postASpotImage';
const GET_CURRENT_USER_SPOTS = 'spots/getCurrentUserSpots';
const UPDATE_A_SPOT = 'spots/updateASpot';
const DELETE_A_SPOT = 'spots/deleteASpot';

//action creator
//no parameter
const loadAllSpots = (allSpots) => {
  return {
    type: LOAD_ALL_SPOTS,
    allSpots: allSpots
  };
};
//use this to receive the spot, to pass into the reducer
const getSpotDetails = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    spot: spot
  };
};
//this spotData is passed into the reducer
const postASpot = (spotData) => {
  return {
    type: POST_A_SPOT,
    spotData: spotData
  };
};
//this spotImage is the data being returned by the POST response
const postASpotImage = (spotId, spotImageData) => {
  return {
    type: POST_A_SPOT_IMAGE,
    spotId: spotId,
    spotImageData: spotImageData
  }
}
//get curent user spots
const getCurrentUserSpots = (currentUserSpots) => {
  return {
    type: GET_CURRENT_USER_SPOTS,
    currentUserSpots: currentUserSpots
  }
}
//the spotData will be the retured data from PUT
//the data returned/generated will include the id
const updateASpot = (spotData) => {
  return {
    type: UPDATE_A_SPOT,
    spotData: spotData
  };
};

const deleteASpot = (spotId) => {
  return {
    type: DELETE_A_SPOT,
    spotId: spotId
  }
}





//thunk
export const thunkGetAllSpots = () => async (dispatch) => {
  //GET /api/spots
  const res = await csrfFetch("/api/spots");  //fetch

  if(res.ok) {
    //{ Spots: [ {}, {}, ... ]}
    const allSpots = await res.json();
    //console.log('allSpots = await res.json', allSpots)
    dispatch(loadAllSpots(allSpots));
    return allSpots;
  } else  {
    console.log('/api/spots error output');
  }
};
//we use this for details page, and update page
export const thunkGetSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);  //fetch

  if(res.ok) {
    const spotDetails = await res.json();
    console.log('inside thunkGetSpotDetails');
    console.log('spotDetails in thunk', spotDetails);
    dispatch(getSpotDetails(spotDetails));
    return spotDetails;
  } else  {
    console.log('/api/spots/:spotId error here');
  }
}

//thunk for POST A SPOT
export const thunkPostASpot = (spot) => async (dispatch) => {
  //we get back the {} with details of the newly created Spot
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot)
  });

  if(res.ok) {
    const spotData = await res.json();
    console.log('spotData', spotData);
    dispatch(postASpot(spotData));
    return spotData;
  } else  {
    console.log('inside thunkPostASpot error message');
    const error = await res.json();
    console.log('error', error);
    return error;  //if not successful, return the error data back
  }
}

export const thunkPostASpotImage = (spotId, spotImage) => async (dispatch) => {
  //we get back the {} with details of the newly created Spot Images
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotImage)
  });

  if(res.ok) {
    const spotImageData = await res.json();
    console.log('spotId', spotId)
    console.log('spotImageData', spotImageData);
    //action.spotId, action.spotImageData
    dispatch(postASpotImage(spotId, spotImageData));
    return spotImageData;
  } else  {
    console.log('inside thunkPostASpotImage error message');
    const error = await res.json();
    console.log('error', error);
    return error;
  }
}

//thunk get current user's spots
export const thunkGetCurrentUserSpots = () => async (dispatch) => {
  //we get back {} with Spots: [{}, {}..]
  const res = await csrfFetch(`/api/spots/current`);

  if(res.ok) {
    const spotData = await res.json();
    console.log('spotData', spotData);
    dispatch(getCurrentUserSpots(spotData));
    return spotData;
  } else  {
    const error = await res.json();
    console.log('error', error);
    return error;
  }
}

//UPDATE A SPOT
//will take in spotId for the api route, and the spot (spot data)
export const thunkUpdateASpot = (spotId, spot) => async (dispatch) => {
  //Method: PUT
  //URL: /api/spots/:spotId
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot)
  });

  if(res.ok) {
    const spotData = await res.json();
    //console.log('spotData', spotData);
    dispatch(updateASpot(spotData));
    return spotData;
  } else {
    const error = await res.json();
    console.log('error', error);
    return error;
  }
}


//delete a spot
export const thunkDeleteASpot = (spotId) => async (dispatch) => {
  //  Method: DELETE
  // URL: /api/spots/:spotId
  // Body: none
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if(res.ok) {
    const spotData = await res.json();
    //console.log('spotData', spotData);
    dispatch(deleteASpot(spotId));
    return spotData;
  } else {
    const error = await res.json();
    console.log('error', error);
    return error;
  }
}


const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_SPOTS: {  //limited Spots info
      const newState = { ...initialState };
      //console.log('action.allSpots', action.allSpots)
      action.allSpots.Spots.forEach((spot) => newState[spot.id] = spot);
      //console.log('newState', newState);
      return newState;
    }
    case GET_SPOT_DETAILS: {  //this spot is the spotDetails
                              //all key with arrays are created here, state is updated with that
      const newState = { ...state, [action.spot.id]: action.spot };
      //console.log('GET_SPOT_DETAILS newState', newState);
      return newState;
    }
    case POST_A_SPOT: {  //mind your keys in your action
      return { ...state, [action.spotData.id]: action.spotData }
    }
    case POST_A_SPOT_IMAGE: {  //we're only pushing one image at a time
      if (state[action.spotId]['SpotImages']!== undefined) {  //might not need this case until later
        console.log(`state[action.spotId] has SpotImages key, adding to the array..` );
        const newState = { ...state,
          [action.spotId]: {...state[action.spotId], SpotImages: [...state[action.spotId].SpotImages, action.spotImageData]}};
        return newState;
      } else {  //does not have SpotImages key, we create a new key
        console.log(`state[action.spotId] DOES NOT HAVE SpotImages key, creating the key..` );
        const SpotImages = [];
        const newState = { ...state,
          [action.spotId]: {...state[action.spotId], SpotImages: [...SpotImages, action.spotImageData]}};  //this is the same as push
        return newState;
      }
    }
    case GET_CURRENT_USER_SPOTS: {
        //we don't populate using previous state, we only want to populate it with user's spots
        const newState = {};
        //Spots is [{}, {}, ...]
        action.currentUserSpots.Spots.forEach((spot) => newState[spot.id] = spot);
        return newState;
    }
    case UPDATE_A_SPOT: {  //same as create a spot
        return { ...state, [action.spotData.id]: action.spotData };
    }
    //DELETE case, apparently works without, we're not receiving any new data
    default:
      return state;
  }
};

export default spotsReducer;


//POST_A_SPOT_IMAGE
//old attempt, good try, doesnt work
//const newState = { ...state, [action.spotId]: {...state[action.spotId], SpotImages: [...state[action.spotId].SpotImages, action.spotData]} };
//console.log('newState', newState);
