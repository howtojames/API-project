const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');  //called below, same path for users.js
const { Spot, SpotImage, User, Review, Booking } = require('../../db/models');  //changed
//---------------------------------------
// phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  //imported from utilities validation.js
const { all } = require('./session');

//---------------------------------------
//for aggregate functions
const sequelize = require('sequelize');

const router = express.Router();
//---------------------------------------


//missing

//Get all Bookings for a Spot based on the Spot's id

//Delete a Booking

//Delete an Image for a Spot

//Delete an Image for a Review

//pagination





module.exports = router;
