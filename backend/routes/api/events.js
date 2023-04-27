const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors, validateEvent} = require('../../utils/validation');

const { Group, User, Membership, Image, Venue, Event, sequelize, Sequelize} = require('../../db/models');


router.use(express.json());


router.put('/:id', requireAuth, validateEvent, async (req,res) => {
    const eventsId = req.params.id;
    const user = req.user;
    const {groupId, venueId, name, type, capacity, price, description, startDate, endDate} = req.body

    const memberStatus = await Membership.findOne({
        where:{
          memberId: user.id,
          groupId
        },
        attributes: {
          include: ['status']
        }
      });

    const group = await Group.findByPk(groupId)

    const event = await Event.findByPk(eventsId);

    if(!event){
        res.status(404).json({Error: 'Event cannont be found'})
    }if(!event.venueId){
        res.status(404).json({Error: 'No venues associated with event'})
    }if(group.organizerId === user.id || memberStatus === 'status'){
        const newEvent = await event.update({
            id: event.id,
            groupId,
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        })
        res.json(newEvent)
    }else throw new Error('You do not have permission to edit this event')
});

router.get('/:id', async (req, res) => {
    const eventsId = req.params.id;
    const user = req.user;
    const event = await Venue.findByPk(eventsId);
    res.json(event)
})

module.exports = router;
