// phase 4
// backend/routes/api/users.js
// This file will hold the resources for the route paths beginning with /api/users
const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//---------------------------------------

// phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  //imported from utilities validation.js

//---------------------------------------

const router = express.Router();

//---------------------------------------

// added on phase 5
// POST /api/users signup route will expect the body of the request to have a key of username, email, and password with the password of the user being created.
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// It checks to see if req.body.email exists and is an email,
// req.body.username is a minimum length of 4 and is not an email,
// and req.body.password is not empty and has a minimum length of 6.
// If at least one of the req.body values fail the check, an error will be returned as the response.

//---------------------------------------
// Sign up    - similar to sign in
router.post(
    '/',
    validateSignup,  //added in phase 5
    async (req, res) => {
      const { email, password, username } = req.body;   //get info
      const hashedPassword = bcrypt.hashSync(password);   //hash password
      const user = await User.create({ email, username, hashedPassword }); //create user

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );
//-------------------------------------



module.exports = router;
