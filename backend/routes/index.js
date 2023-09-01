// backend/routes/index.js
const express = require('express');
const router = express.Router();

// phase - 1 testing (removed)
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });
//In this test route, you are setting a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken
//sending the text, Hello World! as the response's body.

//---------------------------------
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
});
//This route should not be available in production, but it will not be exclusive to the production application until you implement the frontend of the application later. So for now, it will remain available to both the development and production environments.

//---------------------------------
//phase 2
// backend/routes/index.js
const apiRouter = require('./api');  //every single middleware in the api/ folder

router.use('/api', apiRouter);  //just to append /api before all the other routes, since app.js already appends the router

//so all the routes in the api folder needs to start with /api

module.exports = router;
