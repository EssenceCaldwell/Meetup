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
    const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName'],
        include:{
            model: Attendance,
            attributes: ['status'],
            where: {
                eventId
            }
        }
    })
    res.json(users)
    }
    const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName'],
        include:{
            model: Attendance,
            attributes: ['status'],
            where:{
                eventId,
                status: ['member', 'waitlist']
            }
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
        userId: user.id,
        eventId,
        status: 'pending'
    }
})
const userStatusMember = await Attendance.findOne({
    where:{
        userId: user.id,
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
    userId: user.id,
    eventId,
    status: 'pending'
});

const results = await Attendance.findOne({
    where: {
        userId: user.id,
        eventId
    },
    attributes: {
        exclude: ['createdAt', 'updatedAt']
    }
})
res.json(results)
})

//Change the status of an attendance for an event specified by id
router.put('/:id/attendees/:userId', requireAuth, async (req, res) => {
    const {status} = req.body
    const user = req.user;
    const userId = req.params.userId
    const eventsId = req.params.id;

    const memberInfo = await Attendance.findOne({
        where:{
            userId,
            eventId: eventsId
        }
    })
    console.log(memberInfo)

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
            userId: userId
        },
        {where: {
            eventId: eventsId,
            userId
        }})

        const response = await Attendance.findOne({
            where:{
                userId,
                eventId: eventsId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.json(response)
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
const {userId} = req.body
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
            userId,
            eventId
        }
     })
    console.log(member)

    if(!member){
        res.status(404).json({ message: "Attendance does not exist for this User", statusCode: 404})
    }
    const owner = event.Group.dataValues.organizerId
    if(user.id === owner || user.id === userId){
    await Attendance.destroy({
        where:{
            userId,
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
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }

const attendeeStatus = await Attendance.findOne({
        where: {
            eventId,
            userId: user.id
        }
    })

if(attendeeStatus){
        newImage = await event.createImage({
            url,
            preview
        })

        const addedImage = await Image.findByPk(newImage.dataValues.id, {
            attributes: {
                include: ['url', 'preview']
            }
        })
        res.json(addedImage)
    }
    res.status(400).json('Only users who have attended can add photos')
})

//Edit an Event specified by its Id
router.put('/:id', requireAuth, validateEvent, async (req,res) => {
    const eventsId = req.params.id;
    const user = req.user;
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    const newStartDate = startDate.slice(0 , 10);
    const newEndDate = endDate.slice(0 , 10)


    const event = await Event.findByPk(eventsId);
    if(!event){
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }
    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId)
    const venue = await Venue.findByPk(venueId)

    if(!venue){
        res.status(404).json({
            "message": "Venue couldn't be found",
            "statusCode": 404
          })
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
            startDate: new Date(newStartDate),
            endDate: new Date(newEndDate)
        },)
        const updatedEvent = await Event.findByPk(newEvent.dataValues.id, {
            attributes: {
                exclude: ['previewImage']
            }
        })
        res.json(updatedEvent)
    }else throw new Error('You do not have permission to edit this event')
});

//Get all Events details of an event specified by its Id
router.get('/:id', async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId,
        {
            attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity',
            'price', 'startDate', 'endDate',  [
                Sequelize.fn('COUNT', Sequelize.col('Attendances.userId')),
                'numAttending'
              ]],
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
            ],
            group: ['Event.id', 'Group.id', 'Venue.id', 'Images.id']
        }
        )
       // console.log(event)
        if(event !== null){
            res.json({event})
        }
       //if(!event.length){
       //    res.status(404).json({
       //        "message": "Group couldn't be found",
       //        "statusCode": 404
       //      })
       //}
       res.status(404).json({
        "message": "Event couldn't be found",
        "statusCode": 404
      })
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
    if(page = 0 && size >= 0){
        pagination.limit = size;
        pagination.offset = 0
    }
    if(page > 0 && size >= 0){
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


    const Events = await Event.findAll({
        ...pagination,
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'previewImage'],
        include: [
            {
            model: Group,
            attributes: ['id', 'name', 'city', 'state']}
            ,
            {
            model: Venue,
            attributes:['id', 'city', 'state']}

        ]
    });

    if(!Events){
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }
    if(!Events.length){
        res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
          })
    }
    for (const event of Events) {
        const numAttending = await Attendance.count({
          where: { eventId: event.dataValues.id },
        });
        event.setDataValue('numAttending', numAttending);
    }


    res.json({Events, page, size})
})

module.exports = router;
