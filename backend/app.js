//phase 1 import packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
//------------------------

const { environment } = require('./config');
const isProduction = environment === 'production';
//-----------------------
const app = express(); //initialize express
//-----------------------
app.use(morgan('dev'));    //logging informaiton about requrest and responses
//-----------------------
app.use(cookieParser());   //for parsing cookies
app.use(express.json());   //for pasring json bodies
//-----------------------

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
        }
    })
);
//_csrf cookie that is HTTP-only (can't be read by JavaScript) to any server response.
//It also adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later on.
//XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP verbs besides GET

//all pre-request middleware ends here

//---------------------------------
// backend/app.js
const routes = require('./routes');

// ...

app.use(routes); // Connect all the routes: index.js,...
//where all routes are from

//...
//...

//---------------------------------
//phase 2
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});
//It will catch any requests that don't match any of the routes defined and create a server error with a status code of 404.

//REMEMBER: next invoked with nothing means that error handlers defined after this middleware will not be invoked.
//next invoked with an error means that error handlers defined after this middleware will be invoked.
//self-note: so its looking for an error handling middleware with 4 parameters


//--------------------------------
const { ValidationError } = require('sequelize');

// Process sequelize errors
app.use((err, _req, _res, next) => {   //gets err parameter from the previous next(err)
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {  //for each error in err.errors
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;   //err.errors = errors object we just populated with eacherror.path: eacherror.message
  }   //self-note: passes those formatted err.errors with path: message into the err parameter,
  next(err);   //then passes that formatted err into the next error handling middlewares
});
//this handler is for catching Sequelize errors and formatting them before sending the error response.


//--------------------------------
// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
});
//formatting all the errors before returning a JSON response
//It will include the error message, the error messages as a JSON object with key-value pairs, and the error stack trace (if the environment is in development) with the status code of the error message.





//---------------------------------
module.exports = app;
