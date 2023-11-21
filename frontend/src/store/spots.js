const LOAD_ALL_SPOTS = "spots/loadAllSpots";
//get a single spot
//const GET_SPOT_DETAILS = "spots/getSpotDetails"

//action creator
//no parameter
const loadAllSpots = (allSpots) => {
  return {
    type: LOAD_ALL_SPOTS,
    allSpots: allSpots
  };
};


//use this to receive the spot, to pass into the reducer
// const getSpotDetails = (spot) => {
//   return {
//     type: GET_SPOT_DETAILS,
//     spot: spot
//   };
// };





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

// export const thunkGetSpotDetails = (spotId) => async (dispatch) => {

//   const res = await fetch(`/api/spots/${spotId}`);

//   if(res.ok) {
//     const spotDetails = await res.json();
//     console.log('spotDetails', spotDetails);
//     dispatch(getSpotDetails(spotDetails));
//     return spotDetails;
//   } else  {
//     console.log('/api/spots/:spotId error here');
//   }
// }



const initialState = { allSpots: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_SPOTS: {
      let newState = { ...initialState, allSpots: {}};  //new ref
      //console.log('action.allSpots', action.allSpots)
      action.allSpots.Spots.forEach((spot) => newState.allSpots[spot.id] = spot);
      //console.log('newState', newState);
      return newState;
    }
    // case GET_SINGLE_SPOT: {
    //   let newState = {...initialState, singleSpot: {}};
    //   return null;
    // }
    default:
      return state;
  }
};

export default spotsReducer;
