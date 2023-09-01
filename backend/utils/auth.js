// backend/utils/auth.js

//phase 3
//to store auth helper functions
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;
//-----------------------------------------

// This first function is setting the JWT cookie after a user is logged in or signed up.
// this is a function, not a middleware
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {  //we pass in a logged in / signed up user
    // Create the token.
    const safeUser = {        //creates the JWT
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(     //signs the JWT
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie     -in the reponse sent back
    res.cookie('token', token, {       //set the JWT in the "token" cookie
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;  //because this is a function
};


//--------------------------------
// Certain authenticated routes will require the identity of the current session user.
// restoreUser  - this is a global middleware, we did app.use(restoreUser) in api/index.js
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;   //check to see if we have a token
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {  //verify the method, to verify that the jwt hasnt been tampered with
      if (err) {   //if we don't have a token
        return next();   //user is not logged in, allows a request to paxs through
      }

      try {   //if JWT exists
        const { id } = jwtPayload.data;   //safeUser.id from the token data created on line 23
        req.user = await User.findByPk(id, {  //if a user is found.  + we can use this later to compare this to the req.params, req.query
          attributes: {
            include: ['email', 'createdAt', 'updatedAt'] //include these 3 attrubutes that are set by the User model, will override the model scope
          }
        });
      } catch (e) {
        res.clearCookie('token');   //if a user is not found, we clear the token, then set req.user to null
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();    //the next middlewear is whatever comes after route.use(restoreUser) in /api/index.js
    });
  };
  //restoreUser middleware will connect to the API router so that all API routes handlers will check if a User is logged in or not


//------------------------------------

// Require Auth - NOT a global middleware, only apply to some endpoints
// middleware to add is for requiring a session user to be authenticated before accessing a route.
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {   //middleware only applied to certain endpoints
    if (req.user) return next();   //checks if we have successfully loggeed in a user

    const err = new Error('Authentication required');   //if req.user does not exist, we throw an error and it will be passed to error handling middelwares, if they're not logged in
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);   //this goes into the next error handling middleware
};
//will be connected to routes where they require a user to be logged in

//for endpoints where users are required to be logged in
//for POST, PUT/PATCH, DELETE

//---------------------------------------

module.exports = { setTokenCookie, restoreUser, requireAuth };

//phase 3
