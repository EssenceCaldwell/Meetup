const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

require('dotenv').config();
require('express-async-errors');
const { handleValidationErrors, validateGroup, validateVenue, validateEvent } = require('../../utils/validation');

const { Group, User, Membership, Image, Venue, Event, Attendance, sequelize, Sequelize} = require('../../db/models');

router.use(express.json());

//Change the status of a membership for a group specified by id
router.put('/:id/membership', requireAuth, async (req, res) => {
  const {memberId, status} = req.body
  const user = req.user;
  const groupId = req.params.id;

  const group = await Group.findByPk(groupId);

  if(!group){
    res.status(404).json({
      "message": "Group couldn't be found",
      "statusCode": 404
    })
  }

const member =await Membership.findOne({
    where: {
      memberId,
      groupId
    }
  })

  if(!member){
    res.status(400).json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "memberId": "User couldn't be found"
      }
    })
  }

  const userInfo = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId
    }
  })

  let statusInfo = ''

  if(userInfo){
    //console.log(userInfo)
    statusInfo = userInfo.dataValues.status

  }
  if(status === 'pending'){
    res.status(400).json({
      "message": "Validations Error",
      "statusCode": 400,
      "errors": {
        "status" : "Cannot change a membership status to pending"
      }
    })

    if(status === 'co-host' || group.dataValues.organizerId !== user.id){
      res.status(403).json({Error: 'Only group owner can make that change'})
    }
  }

  if(group.dataValues.organizerId === user.id || statusInfo === 'co-host'){
   // console.log(mem)
     member.update({
      memberId,
      groupId,
      status
    })
  }else{res.status(403).json({Error: "You don't have permission to do that"})}

  res.json(member)
})

//Create a new Venue for a Group specified by its id
router.post('/:id/venues', requireAuth, validateVenue ,async (req, res) => {
  const groupsId = req.params.id;
  const user = req.user;
  const { address, city, state, lat, lng} = req.body

  const memberStatus = await Membership.findOne({
    where:{
      memberId: user.id,
      groupId: groupsId
    },
    attributes: {
      include: ['status']
    }
  });

  const group = await Group.findOne({
    where:{
      id: groupsId
    },
    include:{
      model: Venue,
      attributes: []
    }
  })
if(!group){
  res.status(400).json({Error: 'Group does not exist'})
}if(!memberStatus){throw new Error('You do not have permission to edit this group')
}if(group.organizerId === user.id || memberStatus.status === 'co-host'){
 const newVenue = await group.createVenue({
    groupId: groupsId,
    address,
    city,
    state,
    lat,
    lng
 },)
 res.json({newVenue})
 } throw new Error('You do not have permission to edit this group')
})

//Create and Event by Group Id
router.post('/:id/events', requireAuth, validateEvent, async (req, res) => {
  const {venueId, name, type, capacity, price, description, startDate, endDate } = req.body
const user = req.user;
const groupId = req.params.id;
const group = await Group.findByPk(groupId)
const organizer = group.dataValues.organizerId
const memberStatus = await Membership.findOne({
  where: {
    groupId,
    memberId: user.id
  },
  attributes: ['status']
})
let status
let validVenue
console.log(memberStatus)
if(!memberStatus){
status = ''
}
if(memberStatus){
  status = memberStatus.dataValues.status
}
if(venueId !== undefined){
  validVenue = await Venue.findOne({
    where: {id:venueId}
  });
  if(!validVenue){
    res.status(404).json({Error: 'Venue does not exist'})
  }
}
if(organizer === user.id || status === 'co-host'){
const newGroup = await group.createEvent({
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
res.json(newGroup)
}
res.status(400).json({Error: 'You do not have permission to edit this Group'})
})

//Get All Events by Group Id
router.get('/:id/events', async (req, res) => {
  const groupsId = req.params.id;
  const groups = await Group.findOne({
    where: { id: groupsId },
    attributes: ['id', 'name', 'city', 'state'],
    include: [
     {
      model: Event,
      attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate',
      'previewImage', [Sequelize.fn('COUNT', Sequelize.col('attendeeId')), 'numAttending']],
      include: [
       { model: Attendance,
        attributes: []}
      ]
    },
    {
      model: Venue,
      attributes: ['id', 'city', 'state']
    }
    ],
    //group: ['Event.id']
  });
if(!groups){
  res.status(404).json({Error: 'Group does not exist'})
}
  res.json({groups})
});

//Add an Image to a Group based on the Groups id
router.post('/:id/images', requireAuth, async (req, res) => {
const {url, preview} = req.body;
const user = req.user
const groupId = req.params.id;
const group = await Group.findByPk(groupId);
if(!group){
  res.status(400).json({Error: 'Group does not exist'})
}
if(user.id !== group.organizerId){
  res.status(400).json({Error: 'You do not own this group'})
}
const img = await group.createImage({url, preview})
res.json(img)
})

//Get all Venues for a Group Specified by Id
router.get('/:id/venues', async (req, res) => {
  const groupsId = req.params.id;

  const venue = await Venue.findAll({
    where: {
      groupId: groupsId
    },
    attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
  });
  const group = await Group.findByPk(groupsId)
  if(!group){ res.status(404).json({Error: 'Group could not be found'})}
  res.json(venue)
})

//Request Membership to a Group
router.post('/:id/membership', requireAuth, async (req, res) => {
  const groupsId = req.params.id;
  const user = req.user;

  const existingMembership = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId: groupsId
    }
  })

  const group = await Group.findOne({
    where:{ id : groupsId}
  });
  if(!group){
    res.status(404).json({Error: 'Group cannont be found'})
  }if(existingMembership){
    res.status(400).json({Error: 'You have already applied to this group'})
  };
  const newMember = await Membership.create({memberId: user.id, groupId: groupsId, status: 'pending'});
  res.json(newMember)
})

//Get All Members of a Group based on the Group's id
router.get('/:id/members', async (req, res) => {
  const newId = req.params.id
  const user = req.user

  let group = await Group.findByPk(newId);
  //console.log(user.id)

  if(!group){
    res.status(404).json({Error: 'This group does not exist'})
  }if(user.id === group.dataValues.organizerId){
    //console.log('HIT THIS PART!!!!!!!!!!!!!!!!')
    const members = await group.getUsers({
      attributes: ['id', 'firstName', 'lastName', [sequelize.literal('"Membership"."status"'), 'status']],
      joinTableAttributes: []
    })
    console.log(members)
    res.json({members})
 }if(group.dataValues.organizerId !== user.id) {
  //console.log('SHOULD NOT HIT THIS PART!!!!!!!!!!!!!!!!')
  const members = await group.getUsers({
    attributes: ['id', 'firstName', 'lastName', [sequelize.literal('"Membership"."status"'), 'status']],
    joinTableAttributes: [],
    through:{
      where:{
        status: ['member', 'co-host']
      }
    }
  })
  res.json({members})
}
}),


//Edit Group by Id
router.put('/:groupId', requireAuth, validateGroup, async (req, res) => {
    const {name, about, type, private, city, state } = req.body
    const user = req.user;
    const groupId = req.params.groupId
    const editGroup = await Group.findOne({
        where: {
            id: groupId
        }
    })
   if(!editGroup){
    return res.status(404).json({ Error: 'No group was found' });
   }if(user.id === editGroup.organizerId){
    editGroup.update({
        name,
        about,
        type,
        private,
        city,
        state
    })
    res.json(editGroup)
  }else{
      res.status(404).json({Error: "You do not have permission to edit this group"})
    }
});

//Delete membership to a group specified by id
router.delete('/:id/membership', requireAuth, async (req, res) => {
  const {memberId} = req.body
const groupsId = req.params.id;
const user = req.user;

const memberStatus = await Membership.findOne({
  where:{
    memberId: user.id,
    groupId: groupsId
  }
});

const group = await Group.findByPk(groupsId)

if(!group){
  res.status(404).json({Error: 'Group not found'})
}
if(!memberStatus){
  res.status(404).json({Error: 'You are not a member of this group'})
}if(group.organizerId !== user.id){
  res.status(403).json({Error: 'You are not allow to delete users'})
}else{
  const member = await Membership.findOne({
    where:{
      memberId,
      groupId: groupsId
    }
  })
  await member.destroy();
  res.json({message: 'Successfully Deleted User'})
}
});


//Delete Group By Id
router.delete('/:groupId', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const user = req.user
  const selectGroup = await Group.findOne({
      where: {
          id: groupId
      }
  });
  console.log(selectGroup.dataValues.organizerId)
  if(!selectGroup){
    res.status(404).json({Error: "Group does not exist."})
  }
  if(user.id !== selectGroup.dataValues.organizerId){
    res.status(404).json({Error: 'You do not have permission to delete group'})
  }else{
    await selectGroup.destroy()
    res.json({message: 'Successfully deleted'})
  }
});

//Get All Groups Joined Or Organized by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const user = req.user;
  const userOrganizer = await Group.findAll({
    where: {
      organizerId: user.id
    }, attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('memberId')),
          'numMembers'
        ]
      ]
    },
    include: [
      {
        model: Membership,
        attributes: [],
      }
    ],
    group: ['Group.id']
  });

  const groups = await Membership.findAll({
    where: {
      memberId: user.id
    },
    attributes: ['groupId']
  });

  let userMemberships = []
  //console.log(groups)

  for(let i = 0; i < groups.length; i++){
    let groupInfo = groups[i].dataValues.groupId
    console.log(groupInfo)
    const member = await Group.findOne({
      where: {id: groupInfo},
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('memberId')),
            'numMembers'
          ]
        ]
      },
      include: [
        {
          model: Membership,
          attributes: [],
        }
      ],
      //group: ['Group.id']
    })
    userMemberships.push(member.dataValues)
  }
  //console.log(userMemberships)
  res.json({userOrganizer, userMemberships})
})

//Get Details of a Group from an Id
router.get('/:id', async (req, res) => {
  const groupId = req.params.id;

  const group = await Group.findByPk(
    groupId,
    {
    attributes:{
      include:[
        [
          Sequelize.fn('COUNT', Sequelize.col('Users.Membership.memberId')),
          'numMembers'
        ]
      ]
    },
      include:[
      {
        model: Image,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        attributes: [],
        through: {attributes: []}
      }
    ],
    raw: true
  });
  console.log(group)
  if(!group.id){
  return res.status(404).json({Error: 'Group could not be found'})
  }
  const organizerId = group.organizerId

  const organizer = await User.findOne({
  where: {id: organizerId},
  attributes: ['id', 'firstName', 'lastName']
  } )


  res.json({group, organizer})
});

//Create New Group
router.post('/', requireAuth, validateGroup, async (req, res, next) => {
  const {name, about, type, private, city, state} =  req.body;
  const user = req.user
  const newGroup = await Group.create({
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId: user.id
  })
  res.json(newGroup)
});

//Get All Groups
router.get('/', async (req, res) => {

    const allGroups = await Group.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('Users.Membership.memberId')),
            'numMembers'
          ]
        ]
      },
      include: [
        {
          model: User,
          attributes: [],
          through: {
            attributes: []
          }
        }
      ],
      group: ['Group.id']
    });

    res.json({ allGroups });
});



module.exports = router
