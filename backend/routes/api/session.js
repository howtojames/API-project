// phase 4
// will hold resources for the route path beginning with /api/session
// backend/routes/api/session.js
const express = require('express')
//--------------------------------------
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');  //import the function and middleware from the utilities
const { User } = require('../../db/models');
//--------------------------------------
// phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  //import from utils/validation.js
//--------------------------------------
const router = express.Router();

//--------------------------------------

// phase 5  - put this on top so that post /api/session can access validateLogin
// middleware called validateLogin that will check these keys and validate them
// POST /api/session login route will expect the body of the request to have a key of credential with either the username or email of a user and a key of password with the password of the user

const validateLogin = [
    check('credential')   //imported middleware
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors   //middleware
];
// It checks to see whether or not req.body.credential and req.body.password are empty. If one of them is empty, then an error will be returned as the response.

//---------------------------------------

// Log in
router.post(
    '/',
    validateLogin,  //added in phase 6
    async (req, res, next) => {
      const { credential, password } = req.body;   //passes credential and password into post body

      const user = await User.unscoped().findOne({   //we don't use default scope
        where: {
          [Op.or]: {
            username: credential,    //if we find one of these, return the user
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {  //if the password doens't match, throw an error
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,   //added in phase 5
        lastName: user.lastName,     //added in phase 5
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

// Try setting the credential user field to an empty string. You should get a Bad Request error back.
// Please provide a valid email or username
// other
// Please provide a valid password

//---------------------------------------------

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');      //delete the token and send success message
      return res.json({ message: 'success' });
    }
);
//---------------------------------------------
// phase 4
// GET session user route will return the session user as JSON under the key of user
// Restore session user   - idk why they say restore session user
router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {        //note these places where we are creating a safeUser
          id: user.id,
          firstName: user.firstName,   //added in phase 5
          lastName: user.lastName,     //added in phase 5
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
);

//"token" cookie will display

//--------------------------------------






module.exports = router;
