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






//---------------------------------
module.exports = app;
