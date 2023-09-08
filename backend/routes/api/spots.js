// phase 4
// backend/routes/api/spots.js
// This file will hold the resources for the route paths beginning with /api/users
const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');  //called below, same path for users.js
const { Spot, SpotImage, User, Review } = require('../../db/models');  //changed
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

//format time
function formatTimestamp(timestamp) {
    return timestamp.toJSON().replace('T', ' ').slice(0, 19);
}



const validateSpot = [  //kanban checks for email, firstName, and lastNmae
    check('address')
      .exists({ checkFalsy: true })   //checks that it exists and is not falsey
      .withMessage('Street address is required'),  //changed, Please provide a valid email.
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')                 //validation here
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true})
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true})
      .withMessage('Name is required'),   //added, if name is missing
    check('name')
      .isLength({ max: 49 })   //must be less than 50
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true})
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true})
      .withMessage('Price per day is required'),
    handleValidationErrors
];


const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


//Create a Review for a Spot based on the Spot's id
//Require Authentication: true
//but doesn't require spot to be current user
//review can be created by anyone
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {

    const { spotId } = req.params;

    const { review, stars } = req.body;

    const userId = req.user.id;

    //check if spot exists error
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        //must return or else we will get
        //Error: Cannot set headers after they are sent to the client
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    //check if User already have a review for the Spot
    const userReview = await Review.findAll({
        where: {
            spotId,   //get all reviews for this spot
            userId    //made by current user
        }
    });
    //userReview is an array of sequelize Review instances
    //if it's 1 (or greate, shouldn't be)
    if(userReview.length >= 1){
        //403 or 500 both accepted
        return res.status(403).json({
            message: "User already has a review for this spot"
        });
    };

    //creating a single one
    const newReview = await Review.create({
        userId,
        spotId: parseInt(spotId), //it was string in params
        review,
        stars
    });
    //format timestamp
    newReview.dataValues.createdAt = newReview.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
    newReview.dataValues.updatedAt = newReview.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

    return res.json(newReview);

});


//Add an Image to a Spot based on the Spot's id
//get owner first, then get owner's spot
//then add an image to that spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    //get spotId from req.params
    const { spotId } = req.params;
    //get url and preview from req.body
    const { url, preview } = req.body;

    //err handler
    //get the Spot by Id first
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    };  //if it's found then continue


    //Only the owner of the spot is authorized to add an image
    //assuming the owner has to be logged in, we user req.user.id
    const ownerUser = await User.findByPk(req.user.id);
    //User hasMany Spots
    const ownerSpot = await ownerUser.getSpots({
        where: {  //querying in Spots table
            id: spotId //sometimes an owner can have many spots
        }
    });  //returns an array with a single Spot associated with that ownerUser, or no Spot
    //console.log('ownerSpot', ownerSpot);
    //err handler
    if(ownerSpot.length === 0){
        const err = new Error("Spot must belong to the current user");
        err.status = 403; //authorization code
        next(err); //pass to errir
    }

    //if that spot exists in the array, create the SpotImage
    if (ownerSpot.length === 1){
        //Spot hasMany SpotImages, so we can use this association method
        const spotImage = await ownerSpot[0].createSpotImage({
            spotId,
            url,
            preview
        });  //the id is automatically becuause we're using create<Model>

        //create the object to return
        const body = {
            id: spotImage.id,
            url: spotImage.url,
            preview: spotImage.preview
        }

        res.json(body);
    };



});


//---------------------------------------
// Create a Spot,
// authentication required - use requireAuth
// validateSignup to add to error messages
router.post('/', requireAuth, validateSpot, async (req, res) => {

      //get values from body
      const { city, address, state, country, lat, lng, name, description, price } = req.body;   //get info

      //also get user's id from req.user.id
      const id = req.user.id;

      const spot = await Spot.create({ ownerId: id, city, address, state, country, lat, lng, name, description, price });

      //might need to reformat the timestamps

      //change timestamp format
      spot.dataValues.createdAt = spot.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
      spot.dataValues.updatedAt = spot.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

      spot.dataValues.lat = parseFloat(spot.dataValues.lat);
      spot.dataValues.lng = parseFloat(spot.dataValues.lng);
      spot.dataValues.price = parseFloat(spot.dataValues.price);

      return res.status(201).json(spot);
    }
);





//--------------------------------------------
//All PUT
//Require Authentication: true
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {

    const { spotId } = req.params;
    //get values from body
    const { city, address, state, country, lat, lng, name, description, price } = req.body;   //get info, same as post

    //get spot by id
    const spot = await Spot.findByPk(spotId)
    if(!spot){  //this is right, needs to be sparated from 'Spot must belong to the current user'
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    //get spot by Owner
    const ownerUser = await User.findByPk(req.user.id);
    const ownerSpot = await ownerUser.getSpots({
        where: {  //querying in Spots table
            id: spotId //sometimes an owner can have many spots
        }
    });

    //if spot doesn't exist
    if(ownerSpot.length === 0){
        //kanban: Only the owner of the spot is authorized to edit
        const err = new Error("Spot must belong to the current user");
        err.status = 403; //authorization code
        next(err); //pass to errir
    } else if (ownerSpot.length === 1){  //if owner's spot exists
        //Spot hasMany SpotImages, so we can use this association method

        await ownerSpot[0].update({
            city, address, state, country, lat, lng, name, description, price
        });


        ownerSpot[0].dataValues.createdAt = ownerSpot[0].dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        ownerSpot[0].dataValues.updatedAt = ownerSpot[0].dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);


        res.json(ownerSpot[0]);
    };

});





// All GET
// changed order
//-------------------------------------


//Get all Spots owned by the Current User
//Require Authentication: true
router.get('/current', requireAuth, async (req, res) => {

    const userId = req.user.id;

    const allSpots = await Spot.findAll({
        where: {
            ownerId: userId
        }
    });

    for(let spot of allSpots){
        const avgRating = await spot.getReviews({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        });
        const previewImage = await spot.getSpotImages({
            attributes: ['url'],
            where: {
                preview: true
            }
        });

        if(avgRating[0].dataValues.avgRating === null){
            spot.dataValues.avgRating = 0;
        } else {
            spot.dataValues.avgRating = parseInt(avgRating[0].dataValues.avgRating)
        }
        if( previewImage.length === 0 ){
            spot.dataValues.previewImage = "no url exists, create a SpotImage url with preview true for the Spot";
        } else if ( previewImage[0].dataValues.url ) {
            spot.dataValues.previewImage = previewImage[0].dataValues.url;
        }

        //from index 0 to 18
        spot.dataValues.createdAt = spot.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        spot.dataValues.updatedAt = spot.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);


        spot.dataValues.lat = parseFloat(spot.dataValues.lat);
        spot.dataValues.lng = parseFloat(spot.dataValues.lng);
        spot.dataValues.price = parseFloat(spot.dataValues.price);




    }; //now each value in allSpots is added aggregate data


    return res.json(
        {
            Spots: allSpots
        }
    );

});


//GET Details of a Spot from an id
//Require Authentication: false, no middleware needed
router.get('/:spotId', async (req, res) => {

    //get spotId from params
    const { spotId } = req.params;
    //get a single spot by id
    const spot = await Spot.findByPk(spotId, {  //assocaited to SpotImage, and User
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'] //i cri
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
        ]
    });
    //if spot not found
    if(!spot){
        res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    //aveRating
    const avgRating = await spot.getReviews({
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ]
    });
    if(avgRating[0].dataValues.avgRating === null){
        spot.dataValues.avgRating = 0;
    } else {
        spot.dataValues.avgRating = parseInt(avgRating[0].dataValues.avgRating)
    };


    const numReviews = await spot.getReviews({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews']
        ]
    });
    if(numReviews[0].dataValues.numReviews === null){
        spot.dataValues.numReviews = 0;
    } else {
        spot.dataValues.numReviews = parseInt(numReviews[0].dataValues.numReviews)
    };




    //format timestamp
    spot.dataValues.createdAt = spot.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
    spot.dataValues.updatedAt = spot.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

    spot.dataValues.lat = parseFloat(spot.dataValues.lat);
    spot.dataValues.lng = parseFloat(spot.dataValues.lng);
    spot.dataValues.price = parseFloat(spot.dataValues.price);

    for(let image of spot.SpotImages){
        image.dataValues.preview = Boolean(image.dataValues.preview)
    }

    //change to Owner key, delete User key
    spot.dataValues.Owner = spot.dataValues.User;
    delete spot.dataValues.User;

    //console.log(spot.SpotImages)
    //go into each object, and then get each dataValue to get the key
    //i cri
    // for(let image of spot.SpotImages){
    //     //console.log(image.dataValues.createdAt)
    //     image.dataValues.createdAt = image.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
    //     image.dataValues.updatedAt = image.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);
    // }

    res.json(spot);
});

// Get All Spots
// including aggregate data
router.get('/', async (req, res) => {

    //returns an array
    const allSpots = await Spot.findAll();
    //console.log("type", typeof allSpots);
    //change it from promise to json
    //const allSpotsJSON = allSpots.toJSON();

    //console.log('allSpots', allSpots[0].id)
    //let i = 1;
    //go through each spot in allSpots
    for(let spot of allSpots){
        // forEach spot, calcualte the avgRating, and get all previewImage associated to
        //review is associated to Spot, use spot.get< > , tuesday long practice
        const avgRating = await spot.getReviews({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']  //monday practice
            ]
        });
        //avgRating is a sequelize model instance
        //key into first Review object, get dataValues (with s!), get avgRating
        //console.log('avgRating', avgRating[0].dataValues.avgRating);

        const previewImage = await spot.getSpotImages({
            attributes: ['url'],
            where: {
                preview: true
            }
        });
        //instance of SpotImage model
        //console.log('previewImage', previewImage[0].dataValues.url); //string

        //console.log('before assigning values');
        //add key:value to that spot
        //again, spot is a sequelize model instance

        //console.log(typeof avgRating[0].dataValues.avgRating);


        if(avgRating[0].dataValues.avgRating === null){
            spot.dataValues.avgRating = 0;
        } else {
            spot.dataValues.avgRating = parseInt(avgRating[0].dataValues.avgRating)
        };



        //console.log(`loop ${i} before previewImage`);

        if( previewImage.length === 0 ){
            spot.dataValues.previewImage = "no url exists, create a SpotImage url with preview true for the Spot";
        } else if ( previewImage[0].dataValues.url ) {
            spot.dataValues.previewImage = previewImage[0].dataValues.url;
        }

        spot.dataValues.createdAt = spot.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        spot.dataValues.updatedAt = spot.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

        spot.dataValues.lat = parseFloat(spot.dataValues.lat);
        spot.dataValues.lng = parseFloat(spot.dataValues.lng);
        spot.dataValues.price = parseFloat(spot.dataValues.price);
    };

    return res.json(
        {
            Spots: allSpots
        }
    );  //wants an body with object and and then Spots: array of objects

});


//ALL DELETE
//delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    //get spot
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        res.status(404).json({  //can't find spot
            message: "Spot couldn't be found"
        });
    };

    //get spot by Owner
    const ownerUser = await User.findByPk(req.user.id);
    const ownerSpot = await ownerUser.getSpots({
        where: {  //querying in Spots table
            id: spotId //sometimes an owner can have many spots
        }
    });

    //if spot doesn't exist
    if(ownerSpot.length === 0){
        //kanban: Only the owner of the spot is authorized to edit
        const err = new Error("Spot must belong to the current user");
        err.status = 403; //authorization code
        next(err); //pass to errir
    } else if (ownerSpot.length === 1){  //if owner's spot exists
        //Spot hasMany SpotImages, so we can use this association method

        //delete
        try {
            await ownerSpot[0].destroy();
            res.json({
                message: "Successfully deleted"
            });
        } catch (e) {
            res.json('something went wrong with deleting')
        }

    };

});


module.exports = router;





// const avgRating = await spot.getReviews({  //avgRating
//     attributes: [
//         [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
//     ]
// });
// spot.dataValues.avgRating = avgRating[0].dataValues.avgRating ? avgRating[0].dataValues.avgRating : 0;



// const previewImage = await spot.getSpotImages({  //previewImage
//     attributes: ['url'],
//     where: {
//         preview: true
//     }
// });
// if( previewImage.length === 0 ){
//     spot.dataValues.previewImage = "no url exists, create a SpotImage url with preview true for the Spot";
// } else if ( previewImage[0].dataValues.url ) {
//     spot.dataValues.previewImage = previewImage[0].dataValues.url;
// }



// const numReviews = await spot.getReviews({
//     attributes: [
//         [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews']
//     ]
// });
// spot.dataValues.numReviews = numReviews[0].dataValues.numReviews? numReviews[0].dataValues.numReviews : 0;
