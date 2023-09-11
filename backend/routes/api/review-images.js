const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');  //called below, same path for users.js
const { Spot, SpotImage, User, Review, Booking, ReviewImage, sequelize } = require('../../db/models');  //changed
//---------------------------------------
// phase 5
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');  //imported from utilities validation.js
const { all } = require('./session');

//---------------------------------------
//for aggregate functions
const { Op } = require('sequelize');

const router = express.Router();
//---------------------------------------


//Delete a Review Image
//Require Authentication: true
//Require proper authorization: Review must belong to the current user

router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const { imageId } = req.params;

    const reviewImage = await ReviewImage.findByPk(imageId, {
        include: {
            model: Review
        }
    });


    if(!reviewImage){
        return res.status(404).json({
            message: "Review Image couldn't be found"
        });
    }

    //check if spot belngs to user
    //get userId from Review object
    if(req.user.id === reviewImage.Review.userId){
        //delete it
        await reviewImage.destroy();
        return res.json({
            message: "Successfully deleted"
        });
    } else {
        const err = new Error("Review must belong to the current user");
        err.status = 403;
        next(err);
    }

});





module.exports = router;
