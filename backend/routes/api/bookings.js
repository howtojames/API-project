const express = require('express')
//---------------------------------------
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');  //called below, same path for users.js
const { Spot, SpotImage, User, Review, Booking, sequelize } = require('../../db/models');  //changed
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

const validateBooking = [
    check('endDate')
      .exists({ checkFalsy: true })
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate).getTime();   //wk13 monday
        const endDate = new Date(value).getTime();
        return endDate <= startDate ? false : true;  //if endDate is before startDate, return false
      })
      .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
];


//Get all of the Current User's Bookings
//Require Authentication: true
router.get('/current', requireAuth, async (req, res, next) => {

    const userId = req.user.id;

    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include: {
                model: SpotImage    //querying here affects of everything before it, we want all Spots, so no query here
            }
        }
    });

    //format startDate, endDate, createdAt, updatedAt, previewImage
    for(let booking of bookings){

        //console.log('here',booking.dataValues.Spot.SpotImages[0].dataValues.url)

        if(booking.dataValues.Spot !== null){  //where are some Spot instances that are null
            let spot = booking.dataValues.Spot;
            if( spot.SpotImages.length === 0){
                spot.dataValues.previewImage = "no url exists, create a SpotImage url with preview true for the Spot";

            } else if ( spot.SpotImages[0].dataValues.url ) {  //if the first preview image in the array exists
                spot.dataValues.previewImage = spot.SpotImages[0].dataValues.url;  //set the first preview Image

            }
            //console.log('here', booking.dataValues.Spot.dataValues.SpotImages);
            delete booking.dataValues.Spot.dataValues.SpotImages;

            spot.dataValues.lat = parseFloat(spot.dataValues.lat);
            spot.dataValues.lng = parseFloat(spot.dataValues.lng);
            spot.dataValues.price = parseFloat(spot.dataValues.price);
        }

        booking.dataValues.createdAt = booking.dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        booking.dataValues.updatedAt = booking.dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

        booking.dataValues.startDate= booking.dataValues.startDate.toJSON().substring(0, 10)
        booking.dataValues.endDate = booking.dataValues.endDate.toJSON().substring(0, 10)
    }

    res.json({
        Bookings: bookings
    });

});


//Edit a Booking
//Require Authentication: true
//Require proper authorization: Booking must belong to the current user
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {

    const { bookingId } = req.params;

    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    }; //ok

    const now = new Date();
    const endDate2 = new Date(booking.endDate);
    if(endDate2 < now) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    };

    //check if booking has a conflicting
    const bookingConflict = await Booking.findOne({  //booking has spotId
        where: {
            spotId: booking.spotId,  //find if that spot exists based on the bookingId
            startDate: {
                [Op.lte]: new Date(endDate) //that booking startDate's earlier than user input's endDate
            },
            endDate: {
                [Op.gte]: new Date(startDate)  //that booking endDate's earlier than user input's endDate
            }
        }
    }); //can also do findAll
    if (bookingConflict) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
              endDate: "End date conflicts with an existing booking"
            }
        });
    };


    //Booking must belong to currentUser
    const currentUser = await User.findByPk(req.user.id);
    const userBookings = await currentUser.getBookings({   //bookings only belong to the currentUser
        where: {
            id: bookingId
        }
    });
    //Booking must belong to the current user
    if(userBookings.length === 0){
        const err = new Error("Booking must belong to the current user");
        err.status = 403; //authorization code
        next(err);
    } else if (userBookings.length === 1){

        await userBookings[0].update({
            startDate, endDate
        });

        userBookings[0].dataValues.startDate= userBookings[0].dataValues.startDate.toJSON().substring(0, 10)
        userBookings[0].dataValues.endDate = userBookings[0].dataValues.endDate.toJSON().substring(0, 10)

        userBookings[0].dataValues.createdAt = userBookings[0].dataValues.createdAt.toJSON().replace('T', ' ').slice(0, 19);
        userBookings[0].dataValues.updatedAt = userBookings[0].dataValues.updatedAt.toJSON().replace('T', ' ').slice(0, 19);

        return res.json(userBookings[0]);
    }

});


//Delete a Booking
//Require Authentication: true
//Require proper authorization: Booking must belong to the current user or the Spot must belong to the current user
router.delete('/:bookingId', requireAuth, async (req, res, next) => {

    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId);
    if(!booking){
        res.status(404).json({
            message: "Booking couldn't be found"
        });
    } else { //if booking exists

        //get spot by Owner
        const currentUser = await User.findByPk(req.user.id);
        const userBooking = await currentUser.getBookings({
            where: {  //querying in Spots table
                id: bookingId //sometimes an owner can have many spots
            }
        });

        const userSpot = await booking.getSpot();
        if(userSpot === null){ //check if spot exists
            const err = new Error("Booking must belong to the current user or the Spot must belong to the current user");
            err.status = 403; //authorization code
            next(err); //pass to err
        }

        //if spot doesn't exist
        if(userBooking.length === 0 || userSpot === null){
            //kanban: Only the owner of the spot is authorized to edit
            const err = new Error("Booking must belong to the current user or the Spot must belong to the current user");
            err.status = 403; //authorization code
            next(err);
        } else if (userBooking.length >= 1){


            const dateNow = new Date();
            const startDate = booking.startDate;  //key into the object
            //const endDate = booking.endDate;
            //this takes in account of all past bookings too, which cant be deleted
            if(dateNow >= startDate){
                return res.status(403).json({  //api docs says 403, kanban says 400
                    message: "Bookings that have been started can't be deleted"
                });
            };


            //delete
            try {
                await userBooking[0].destroy();
                res.json({
                    message: "Successfully deleted"
                });
            } catch (e) {
                res.json('something went wrong with deleting')
            }
        };

    }




})





module.exports = router;
