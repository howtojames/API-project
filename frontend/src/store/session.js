// frontend/src/store/session.js
// phase 1
import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

//action creator
//set the session use in the session slice of state
//to the action creator's input parameter
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

//action creator
//will remove the session user
const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// call the API to login then set the session user from the response
// add a thunk action for the POST /api/session
// use custom csrfRetch function from from frontend/src/store/csrf.js
// The POST /api/session route expects the request body to have
// a key of credential with an existing username or email and a key of password
// After the response from the AJAX call comes back, parse the JSON body of the response
// dispatch the action for setting the session user to the user in the response's body
// Export the login thunk action
// export the reducer as the default export
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};



//-----------------------------------------
const initialState = { user: null };

//session and action's reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};


//-----------------------------------------
// Restore session user thunk action
// Add a thunk action in frontend/src/store/session.js that will
// call the GET /api/session, parse the JSON body of the response,
// and dispatch the action for setting the session user to the user in the response's body.
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
//Here's an example of how to test the restoreUser thunk action:
//window.store.dispatch(window.sessionActions.restoreUser());


//-----------------------------------------
//phase 2
//add a signup thunk action that will hit the signup backend route
//with username, firstName, lastName, email, and password inputs.
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  //After the response from the AJAX call comes back, parse the JSON body of the response,
  //and dispatch the action for setting the session user to the user in the response's body.
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};


//-----------------------------------------



//-----------------------------------------

//phase 3
//logout thunk action
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};
//window.store.dispatch(window.sessionActions.logout());
//works!




// export the reducer as the default export.
export default sessionReducer;



//session slice of state
// {
//     user: {
//       id,
//       email,
//       username,
//       firstName,
//       lastName,
//       createdAt,
//       updatedAt
//     }
//  }

//   if no session user,
//   session slice of state
//   {
//     user: null
//   }
