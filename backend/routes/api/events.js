const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors, validateEvent} = require('../../utils/validation');

const { Group, User, Membership, Image, Venue, Event, Attendance, sequelize, Sequelize} = require('../../db/models');


router.use(express.json());

//Delete an Attendance
router.delete('/:id/attendance', requireAuth, async (req, res) => {
const {attendeeId} = req.body
const user = req.user;
const eventId = req.params.id;
const event = await Event.findByPk(eventId,
    {
        include: {
            model: Group,
            attributes: ['organizerId']
        }
    });

    if(!event){
        res.status(404).json({message: "Event couldn't be found", statusCode: 404})
    }
    const member = await Attendance.findOne({
        where:{
            attendeeId,
            eventId
        }
     })
    console.log(member)

    if(!member){
        res.status(404).json({ message: "Attendance does not exist for this User", statusCode: 404})
    }
    const owner = event.Group.dataValues.organizerId
    if(user.id === owner || user.id === attendeeId){
    await Attendance.destroy({
        where:{
            attendeeId,
            eventId
        }
    })
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    }
        res.status(403).json({
            "message": "Only the User or organizer may delete an Attendance",
            "statusCode": 403
          })

})

//Add an Image to an Event based on the Event's Id
router.post('/:id/images', requireAuth, async (req, res) => {
    const {url, preview} = req.body;
    const eventId = req.params.id
    const user = req.user
    const event = await Event.findByPk(eventId);


if(!event){
        res.status(404).json('Event could not be found')
    }

const attendeeStatus = await Attendance.findOne({
        where: {
            eventId,
            attendeeId: user.id
        }
    })

if(attendeeStatus){
        newImage = await event.createImage({
            url,
            preview
        })
        res.json(newImage)
    }
    res.status(400).json('Only users who have attended can add photos')
})

//Edit an Event specified by its Id
router.put('/:id', requireAuth, validateEvent, async (req,res) => {
    const eventsId = req.params.id;
    const user = req.user;
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body

    const event = await Event.findByPk(eventsId);
    if(!event){
        res.status(404).json({Error: 'Event cannont be found'})
    }
    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId)
    const venue = await Venue.findByPk(venueId)

    if(!venue){
        res.status(404).json({Error: 'No venues associated with this id'})
    }

    const memberStatusInfo = await Membership.findOne({
        where:{
          memberId: user.id,
          groupId
        },
        attributes: {
          include: ['status']
        }
      });
      let memberStatus

    if(memberStatusInfo){
         memberStatus = memberStatusInfo.dataValues.status
      }
    if(!memberStatusInfo){
        memberStatus = ''
       }
    if(group.dataValues.organizerId === user.id || memberStatus === 'co-host' ){
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
        },)
        res.json(newEvent)
    }else throw new Error('You do not have permission to edit this event')
});

//Get all Events of a Group specified by its Id
router.get('/:id', async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId,
        {
            attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity',
            'price', 'startDate', 'endDate', [Sequelize.fn('COUNT', Sequelize.col('attendeeId')),'numAttending']],
            include:[
                {
                model: Attendance,
                attributes: []
                },
                {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
                },
                {
                model: Venue,
                attributes: ['id', 'address', 'city', 'lat', 'lng']
                },
                {
                model: Image,
                attributes: ['id', 'url', 'preview']
                }
            ]
        }
        )
        if(event.id === null){
            res.status(404).json({Error: 'Event does not exist'})
        }

    res.json(event)
});

//Get all Events
router.get('/', async (req, res) => {
    const user = req.user;
    const event = await Event.findAll({
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'previewImage', [Sequelize.fn('COUNT', Sequelize.col('attendeeId')), 'numAttending']],
        include: [
            {model: Group,
            attributes: ['id', 'name', 'city', 'state']}
            ,
            {model: Venue,
            attributes:['id', 'city', 'state']}
            ,
            {
                model: Attendance,
                attributes:[]
            }
        ],
        group: ['Event.id']
    });
    res.json(event)
})

module.exports = router;
