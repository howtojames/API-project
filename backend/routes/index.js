// backend/routes/index.js
const express = require('express');
const router = express.Router();
//----------------------------------
const apiRouter = require('./api');  //every single middleware in the api/ folder

// phase - 1 testing (removed)
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });
//In this test route, you are setting a cookie on the response with the name of XSRF-TOKEN to the value of the req.csrfToken
//sending the text, Hello World! as the response's body.

//---------------------------------
// Moved to the bottom in Frontend - Render
// Add a XSRF-TOKEN cookie
// router.get("/api/csrf/restore", (req, res) => {
//     const csrfToken = req.csrfToken();
//     res.cookie("XSRF-TOKEN", csrfToken);
//     res.status(200).json({
//       'XSRF-Token': csrfToken
//     });
// });
//This route should not be available in production, but it will not be exclusive to the production application until you implement the frontend of the application later. So for now, it will remain available to both the development and production environments.

//---------------------------------
//phase 2
// backend/routes/index.js
// const apiRouter = require('./api');  //every single middleware in the api/ folder

router.use('/api', apiRouter);  //just to append /api before all the other routes, since app.js already appends the router

//so all the routes in the api folder needs to start with /api


//---------------------------------------
// added in FrontEnd - Render
// At the root route, serve the React application's static index.html file along with XSRF-TOKEN cookie.
// Then serve up all the React application's static files using the express.static middleware.
// Serve the index.html and set the XSRF-TOKEN cookie again on all routes that don't start in /api.
// You should already have this set up in backend/routes/index.js which should now look like this:


// // Static routes
// // Serve React build files in production
// if (process.env.NODE_ENV === 'production') {
//   const path = require('path');
//   // Serve the frontend's index.html file at the root route
//   router.get('/', (req, res) => {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.sendFile(
//       path.resolve(__dirname, '../../frontend', 'build', 'index.html')
//     );
//   });

//   // Serve the static assets in the frontend's build folder
//   router.use(express.static(path.resolve("../frontend/build")));

//   // Serve the frontend's index.html file at all other routes NOT starting with /api
//   router.get(/^(?!\/?api).*/, (req, res) => {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.sendFile(
//       path.resolve(__dirname, '../../frontend', 'build', 'index.html')
//     );
//   });
// }

// // Add a XSRF-TOKEN cookie in development
// if (process.env.NODE_ENV !== 'production') {
//   router.get('/api/csrf/restore', (req, res) => {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.status(201).json({});
//   });
// }
//--------------------------------------

//august version
// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}
// backend/routes/index.js
// ...

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.json({});
  });
}


module.exports = router;
