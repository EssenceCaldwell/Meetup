const express = require('express')
const router = express.Router();
const { check } = require('express-validator');
const {Validator} = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors, validateEvent, validateDate} = require('../../utils/validation');

const { Group, User, Membership, Image, Venue, Event, Attendance, sequelize, Sequelize} = require('../../db/models');


router.use(express.json());

//Get all Attendees of an Event specified by its Id
router.get('/:id/attendees', async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  const event = await Event.findByPk(eventId);

  if(!event){
    res.status(404).json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
  }
  const groupId = event.dataValues.groupId;
  const group = await Group.findByPk(groupId);

  const memberInfo = await Membership.findOne({
    where: {
        memberId: user.id,
        groupId
    }
  });

 let status
 //console.log(memberInfo)

  if(!memberInfo){
  status = ''
  }
  if(memberInfo){
    status = memberInfo.dataValues.status
  }
  if(group.dataValues.organizerId === user.id || status === 'co-host'){
    const users = await Attendance.findAll({
        where:{
            eventId
        },
        attributes: ['status'],
        include:{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })
    res.json(users)
    }
    const users = await Attendance.findAll({
        where:{
            eventId,
            status: ['member', 'waitlist']
        },
        attributes: ['status'],
        include:{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })
    res.json(users)
})

//Request to Attend an Event based on the Event's id
router.post('/:id/attendance', requireAuth, async (req, res) => {
const user = req.user;
const eventId = req.params.id;

const event = await Event.findByPk(eventId)

const userStatusPending = await Attendance.findOne({
    where:{
        attendeeId: user.id,
        eventId,
        status: 'pending'
    }
})
const userStatusMember = await Attendance.findOne({
    where:{
        attendeeId: user.id,
        eventId,
        status: 'member'
    }
})

if(!event){
    res.status(404).json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
}if(userStatusPending){
    res.status(400).json({
        "message": "Attendance has already been requested",
        "statusCode": 400
      })
}
if(userStatusMember){
    res.status(400).json({
        "message": "User is already an attendee of the event",
        "statusCode": 400
      })
}
const request = await event.createAttendance({
    attendeeId: user.id,
    eventId,
    status: 'pending'
});
console.log(request)
res.json(request)
})

//Change the status of an attendance for an event specified by id
router.put('/:id/attendance', requireAuth, async (req, res) => {
    const {attendeeId, status} = req.body
    const user = req.user;
    const eventsId = req.params.id;

    const memberInfo = await Attendance.findOne({
        where:{
            attendeeId,
            eventId: eventsId
        }
    })

    //console.log(userInfo.dataValues.status)
    const event = await Event.findByPk(eventsId,{
          include:{
            model: Group,
            attributes: ['organizerId']
          }
    })
    if(!event){
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          }
          )
    }
    const organizer = event.Group.dataValues.organizerId
    const groupId = event.dataValues.groupId

    const userInfo = await Membership.findOne({
        where: {
            memberId: user.id,
            groupId

        }
    })
    if(!userInfo){
        res.status(403).json({Error: 'You are not a part of this group'})
    }
    if(status === "pending"){
        res.status(400).json({
            "message": "Cannot change an attendance status to pending",
            "statusCode": 400
          })
    }
    if(!memberInfo){
        res.status(404).json({
            "message": "Attendance between the user and the event does not exist",
            "statusCode": 404
          })
    }
    if(user.id !== organizer && userInfo.dataValues.status !== 'co-host'){
        res.status(403).json({
            "message": "You do not have permission to alter status",
            "statusCode": 403
          })
    }else {
        await Attendance.update({
            status,
            userId: attendeeId
        },
        {where: {
            eventId: eventsId,
            attendeeId
        }})
        res.json(memberInfo)
    }
})

//Delete an Event speciified by its Id
router.delete('/:id', requireAuth, async (req, res) => {
    const user = req.user;
    const eventId = req.params.id;

    const event = await Event.findByPk(eventId)
    console.log(event)

    if(!event){
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }
    const groupId = event.dataValues.groupId
    const group = await Group.findByPk(groupId)
    const owner = group.dataValues.organizerId
    //console.log(owner)
    const memberStatus = await Membership.findOne({
        where:{
            memberId: user.id,
            groupId
        }
    })

    let status
    if(!memberStatus){
        status = ''
    }
    if(memberStatus){
        status = memberStatus.dataValues.status
    }
    if(user.id === owner || status === 'co-host'){
        await event.destroy()

        res.json({
            "message": "Successfully deleted"
          })

    }
    else{
        res.status(403).json({Error: 'You do not have permission to delete this Event'})
    }
})

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
            startDate: new Date(startDate),
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
    let { page, size , name, type, startDate } = req.query;

    if(type){
        if(type !== 'In person'){
            if(type != 'Online'){
                res.status(400).json({Error: "Type must be 'Online' or 'In person'"})
            }
        }
    }
    if(startDate){
        if(isNaN(Date.parse(startDate))){
            res.status(400).json({Error: ' Start date must be a valid datetime'})
        }
     startDate = new Date(startDate)
     console.log(startDate)
    }

    let pagination = {}

    if(!page) page = 0;
    if(!size) size = 10;

    page = +page;
    size = +size

    if(page < 0){
        res.status(400).json({Error: 'Page must be at least 0'})
    }if (page > 10){
        res.status(400).json({Error: 'Page can not be greater than 10'})
    }
    if(size < 0){
        res.status(400).json({Error: 'Size must be at least 0'})
    }
    if(size > 20){
        res.status(400).json({Error: 'Size can not be greater than 20'})
    }
    if(page >= 0 && size >= 0){
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    if(req.query.name){
        pagination.where = {...pagination.where, name: req.query.name}
    }
    if(req.query.type){
        pagination.where = {...pagination.where, type: req.query.type}
        console.log(pagination.where.type)
    }
    if(req.query.startDate){
        pagination.where = {...pagination.where, startDate: startDate}
    }


    const event = await Event.findAll({
        ...pagination,
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'previewImage', [Sequelize.literal(`(SELECT COUNT(*) FROM "Attendances" WHERE "Attendances"."eventId" = "Event"."id")`
            ),'numAttending']],
        include: [
            {model: Group,
            attributes: ['id', 'name', 'city', 'state']}
            ,
            {model: Venue,
            attributes:['id', 'city', 'state']}
            ,
            {
                model: Attendance,
                attributes:[],
            }
        ]
    });
    if(!event.length){
        res.status(400).json({Error: 'No event exisits with that information'})
    }
    res.json({event, page, size})
})

module.exports = router;
