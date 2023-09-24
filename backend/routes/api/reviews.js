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


const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true})
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];



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

    // console.log('currentUser.id', currentUser.id); //5
    // console.log('review.userId', review.userId)  //5
    // console.log('review.id', review.id)  //4
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


//ALL PUTS
//Require Authentication: true
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {

    const { reviewId } = req.params;

    const { review, stars } = req.body;

    //console.log(reviewId, review, stars);

    //check if reviewExists
    const reviewExists = await Review.findByPk(reviewId);
    if(!reviewExists){
        res.status(404).json({
            message: "Review couldn't be found"
        });
    };


    const currentUser = await User.findByPk(req.user.id);  //exists
    const userReviews = await currentUser.getReviews({   //reviews only belong to the currentUser
        where: {
            id: reviewId
        }
    });

    //if it doen's exist
    if(userReviews.length === 0){
        const err = new Error("Review must belong to the current user");
        err.status = 403; //authorization code
        next(err);
    } else if (userReviews.length === 1){  //if owner's spot exists
        //Spot hasMany SpotImages, so we can use this association method

        await userReviews[0].update({
            review, stars
        });  //note if stars or the other put route needs to be changed


        userReviews[0].dataValues.createdAt = userReviews[0].dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        userReviews[0].dataValues.updatedAt = userReviews[0].dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

        userReviews[0].dataValues.stars = parseInt(userReviews[0].dataValues.stars);  //stars parseInted here
        // spot.dataValues.lng = parseFloat(spot.dataValues.lng);
        // spot.dataValues.price = parseFloat(spot.dataValues.price);

        res.json(userReviews[0]);
    };


});



//All GETS
//---------------------------------------






//Get all Reviews of the Current User
//Require Authentication: true
router.get('/current', requireAuth, async (req, res, next) => {

    const userId = req.user.id;


    //console.log(userId)
    const reviews = await Review.findAll({
        where: {
            userId: userId,
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description','createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    for(let review of reviews){
        review.dataValues.stars = parseInt(review.dataValues.stars);  //just in case
        review.dataValues.createdAt = review.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        review.dataValues.updatedAt = review.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

        //review has only one spot, Spot is an object
        review.dataValues.Spot.dataValues.lat = parseFloat(review.dataValues.Spot.dataValues.lat);
        review.dataValues.Spot.dataValues.lng = parseFloat(review.dataValues.Spot.dataValues.lng);
        review.dataValues.Spot.dataValues.price = parseFloat(review.dataValues.Spot.dataValues.price);

        //for that single spot, should be Spot instance, set previewImage
        const previewImage = await review.dataValues.Spot.getSpotImages({
            attributes: ['url'],
            where: {
                preview: true
            }
        });
        if( previewImage.length === 0 ){
            review.dataValues.Spot.dataValues.previewImage = "no url exists, create a SpotImage url with preview true for the Spot";
        } else if ( previewImage[0].dataValues.url ) {
            review.dataValues.Spot.dataValues.previewImage = previewImage[0].dataValues.url;
        }
    }



    res.json({
        Reviews: reviews
    });

});




router.delete('/:reviewId', requireAuth, async (req, res, next) => {

    const { reviewId } = req.params;  //BIG RIP, not req.body

    const review = await Review.findByPk(reviewId);
    if(!review){
        return res.status(404).json({  //can't find spot
            message: "Review couldn't be found"
        });
    };

    //get current User
    const currentUser = await User.findByPk(req.user.id);

    const userReviews = await currentUser.getReviews({   //reviews only belong to the currentUser
        where: {
            id: reviewId
        }
    });

    //if spot doesn't exist
    if(userReviews.length === 0){
        const err = new Error("Review must belong to the current user");
        err.status = 403; //authorization code
        return next(err);
    } else if (userReviews.length >= 1){  //could have more than 1 review
        //Spot hasMany SpotImages, so we can use this association method

        //delete
        try {
            await userReviews[0].destroy();
            return res.json({
                message: "Successfully deleted"
            });
        } catch (e) {
            return res.json('something went wrong with deleting')
        }

    };

});
















module.exports = router;
