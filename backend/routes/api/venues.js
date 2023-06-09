const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors, validateVenue} = require('../../utils/validation');
const {Venue, Group, Membership} = require('../../db/models')

router.use(express.json());

//Edit a venue based on its Id
router.put('/:id', requireAuth, validateVenue, async (req, res) => {
    const {address, city, state, lat, lng} = req.body
    const user = req.user;
    const venueId = req.params.id;
    const venue = await Venue.findByPk(venueId);

    if(!venue){
        res.status(404).json({
            "message": "Venue couldn't be found",
            "statusCode": 404
          })
    }
    groupId = venue.dataValues.groupId

    const group = await Group.findByPk(groupId)
    const groupOwner = group.dataValues.organizerId

    const memberInfo = await Membership.findOne({
        where: {
            memberId: user.id,
            groupId
        }
    })

    if(!memberInfo){
        res.status(400).json({Error: 'You are not a member of this group'})
    }

    const status = memberInfo.dataValues.status

    if(groupOwner !== user.id && status !== 'co-host'){
        res.status(400).json({Error: 'You do not have permisssion to edit this venue'})
    }

    await venue.update({
    groupId,
    address,
    city,
    state,
    lat,
    lng
    })

    const newVenue = await Venue.findByPk(venueId, {
        attributes: {
            exclude: ['updatedAt', "createdAt"]
        }
    })
    res.json(newVenue)
});

//Get All Venues

router.get('/:venueId', async (req, res) => {
    const id = req.params.venueId
    const venue = await Venue.findByPk(id, {
        attributes: {
            exclude: ['updatedAt', 'createdAt']
        }
    })

    res.json(venue)
})




module.exports = router;
