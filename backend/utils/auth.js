// backend/utils/auth.js

//phase 3
//to store auth helper functions
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;
//-----------------------------------------

// This first function is setting the JWT cookie after a user is logged in or signed up.
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {  //we pass in a logged in / signed up user
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie     -in the reponse sent back
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
};


//--------------------------------
// Certain authenticated routes will require the identity of the current session user.
// restoreUser
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {  //if a user if found
          attributes: {
            include: ['email', 'createdAt', 'updatedAt'] //include these 3 attrubutes that are set by the User model
          }
        });
      } catch (e) {
        res.clearCookie('token');   //if a user is not found, we clear the token, then set req.user to null
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };
  //restoreUser middleware will connect to the API router so that all API routes handlers will check if a User is logged in or not


//------------------------------------

// Require Auth
// middleware to add is for requiring a session user to be authenticated before accessing a route.
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');   //if req.user does not exist, we throw an error and it will be passed to error handling middelwares
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
};
//will be connected to routes where they require a user to be logged in

//---------------------------------------

module.exports = { setTokenCookie, restoreUser, requireAuth };

//phase 3
