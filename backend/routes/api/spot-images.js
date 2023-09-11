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


//Delete a Spot Image
//Require Authentication: true
//Require proper authorization: Spot must belong to the current use

router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const { imageId } = req.params;

    const spotImage = await SpotImage.findByPk(imageId, {
        include: {
            model: Spot
        }
    });


    if(!spotImage){
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        });
    }

    //check if spot belngs to user
    //get ownerId from spotImage's Spot object
    if(req.user.id === spotImage.Spot.ownerId){
        //delete it
        await spotImage.destroy();
        return res.json({
            message: "Successfully deleted"
        });
    } else {
        const err = new Error("Spot must belong to the current user");
        err.status = 403;
        next(err);
    }

});





module.exports = router;
