const LOAD_ALL_SPOTS = "spots/loadAllSpots";


//action creator
//no parameter
const loadAllSpots = (allSpots) => {
  return {
    type: LOAD_ALL_SPOTS,
    allSpots: allSpots
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
    default:
      return state;
  }
};

export default spotsReducer;
