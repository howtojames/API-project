// phase 2
// backend/routes/api/index.js
const router = require('express').Router();
//----------------------------------------
// phase 4
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

const spotsRouter = require('./spots.js');  //added
const reviewsRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js');
const spotImageRouter = require('./spot-images.js');
const reviewImageRouter = require('./review-images.js');
//----------------------------------------
// moved form bottom to top in phase 3
const { restoreUser } = require('../../utils/auth.js');  //import restoreUser from utils/auth.js, its a utility middleware

router.use(restoreUser);  // use restoreUser middleware
//----------------------------------------

//phase 4
router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter); //added, same naming convention. good check

router.use('/reviews', reviewsRouter); //added

router.use('/bookings', bookingRouter);

router.use('/spot-images', spotImageRouter);

router.use('/review-images', reviewImageRouter);

//----------------------------------------


router.post('/test', function(req, res) {   //accepts /api/test            ..except restoreUser would be passed in here
    res.json({ requestBody: req.body });
});
// to test this endpoint, go to console in developer tools
// fetch('/api/test', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//     },
//     body: JSON.stringify({ hello: 'world' })
// }).then(res => res.json()).then(data => console.log(data));

//----------------------------------------

// phase 3
// testing utils/auth.js

// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');  //import the funciton
// const { User } = require('../../db/models');

// router.get('/set-token-cookie', async (_req, res) => {   //if token cookie containint the JWT exists in dev tools, we are logged in
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);    //call with res and user
//   return res.json({ user: user });
// });
//"token" cookie exists in dev tools

//----------------------------------------

// test restoreUser in auth/index.js
// GET /api/restore-user
// const { restoreUser } = require('../../utils/auth.js');  //import restoreUser

// router.use(restoreUser);  // use restoreUser middleware

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);    //sends res.json(res.user)
//   }
// );

//testing - deleted token cookie - then json became null

//----------------------------------------

// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');  //import models
// router.get(
//   '/require-auth',
//   requireAuth,        //uses requireAuth middleware
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

//-----------------------------------------
//end of all user auth middleware tests


module.exports = router;
