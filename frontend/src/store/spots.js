const LOAD_ALL_SPOTS = "spots/loadAllSpots";
//get a single spot
const GET_SPOT_DETAILS = "spots/getSpotDetails"

//action creator
//no parameter
const loadAllSpots = (allSpots) => {
  return {
    type: LOAD_ALL_SPOTS,
    allSpots: allSpots
  };
};


//use this to receive the spot, to pass into the reducer
const getSpotDetails = (spotDetails) => {
  return {
    type: GET_SPOT_DETAILS,
    spotDetails: spotDetails
  };
};





//thunk
export const thunkGetAllSpots = () => async (dispatch) => {
  //GET /api/spots
  const res = await fetch("/api/spots");

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

export const thunkGetSpotDetails = (spotId) => async (dispatch) => {

  const res = await fetch(`/api/spots/${spotId}`);

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



//const initialState = { allSpots: {}, singleSpot: {} };
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
    case GET_SPOT_DETAILS: {
      const newState = { ...state, [action.spotDetails.id]: action.spotDetails };
      //console.log('GET_SPOT_DETAILS newState', newState);
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
