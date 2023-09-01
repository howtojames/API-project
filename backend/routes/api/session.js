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
const router = express.Router();

//--------------------------------------
// Log in
router.post(
    '/',
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
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

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



module.exports = router;
