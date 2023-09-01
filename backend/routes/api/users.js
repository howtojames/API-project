// phase 4
// backend/routes/api/users.js
// This file will hold the resources for the route paths beginning with /api/users
const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//---------------------------------------

const router = express.Router();

//---------------------------------------
// Sign up    - similar to sign in
router.post(
    '/',
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
