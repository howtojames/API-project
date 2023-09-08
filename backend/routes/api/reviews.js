// phase 4
// backend/routes/api/review.js
const express = require('express')
//---------------------------------------

const { requireAuth } = require('../../utils/auth');  //called below, same path for users.js
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');  //changed
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


//Add an Image to a Review based on the Review's id
//Require Authentication: true
//Review must belong to the current user
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {

    const { reviewId } = req.params; //remember to parseInt for id's

    const { url } = req.body;

    const userId = req.user.id;

    //get review the reviewId
    const review = await Review.findByPk(reviewId); //reviewId is review's id
    //last error handler
    if(!review){
        res.status(404).json({
            message: "Review couldn't be found"
        });
    };

    //make sure Review must belong to the current user
    const currentUser = await User.findByPk(userId);

    //Review must belong to the current user
    //each user can have one review

    console.log('currentUser.id', currentUser.id); //5
    console.log('review.userId', review.userId)  //5
    console.log('review.id', review.id)  //4
    // /reviews/4/images for revieId
    if(currentUser.id === review.userId){
        //then get that user's review's images
        const reviewImages = await review.getReviewImages();
        if(reviewImages.length >= 10){
            res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            });
        } else {  //ad an image to a review
            const image = await review.createReviewImage({
                url
            });
            res.json({
                id: image.id,
                url: image.url
            });
        }
    } else { //if review is not currentUser's
        //Require proper authorization: Review must belong to the current user
        const err = new Error("Review must belong to the current user")
        err.status = 403;
        next(err);
    }

});
















module.exports = router;
