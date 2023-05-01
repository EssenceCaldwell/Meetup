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
const realUser = await User.findByPk(memberId)

if(!realUser){
  res.status(400).json({
    "message": "Validation Error",
    "statusCode": 400,
    "errors": {
      "memberId": "User couldn't be found"
    }
  })
}

const member = await Membership.findOne({
    where: {
      memberId,
      groupId
    }
  })

  if(!member){
    res.status(400).json({
      "message": "Membership between the user and the group does not exits",
      "statusCode": 404
    })
  }

  const userInfo = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId
    }
  })

  //console.log(status)

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
  }

  if(group.dataValues.organizerId !== user.id){
    if(status === 'co-host' ){
        //console.log('WHY ARE YOU IN')
        res.status(403).json({Error: 'Only group owner can make that change'})
      }
    }

  if(group.dataValues.organizerId === user.id || statusInfo === 'co-host'){
   // console.log(mem)
    await member.update({status});
    
    const updatedMember = await Membership.findByPk(memberId, {
      attributes: {
        include: ['id', 'groupId', 'memberId', 'status']
      }
    })
    res.json(updatedMember)

  }else{res.status(403).json({Error: "You don't have permission to do that"})}
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
  res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
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
 const venue = await Venue.findByPk(newVenue.dataValues.id, {
  attributes:{
    exclude: ['updatedAt', 'createdAt']
  }
 })
 res.json({venue})
 } throw new Error('You do not have permission to edit this group')
})

//Create and Event by Group Id
router.post('/:id/events', requireAuth, validateEvent, async (req, res) => {
  const {venueId, name, type, capacity, price, description, startDate, endDate } = req.body
const user = req.user;
const groupId = req.params.id;
const group = await Group.findByPk(groupId)
if(!group){
  res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
}
const organizer = group.dataValues.organizerId
const newStartDate = startDate.slice(0 , 10);
const newEndDate = endDate.slice(0 , 10)

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
  startDate: new Date(newStartDate),
  endDate: new Date(newEndDate)
})

const result = await Event.findByPk(newGroup.dataValues.id, {
  attributes:{
    exclude: ['createdAt', 'updatedAt', 'previewImage']
  }
})
res.json(result)
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
      attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'previewImage']
     },
      {
        model: Venue,
        attributes: ['id', 'city', 'state']
      }
      ],

  });
if(!groups){
  res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
}

const members = await groups.getUsers()
const numMembers = await groups.countUsers()
  res.json({groups, numMembers})
});

//Add an Image to a Group based on the Groups id
router.post('/:id/images', requireAuth, async (req, res) => {
const {url, preview} = req.body;
const user = req.user
const groupId = req.params.id;
const group = await Group.findByPk(groupId);
if(!group){
  res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
}
if(user.id !== group.organizerId){
  res.status(400).json({Error: 'You do not own this group'})
}
const img = await group.createImage({url, preview})

const newImg = await Image.findByPk(img.dataValues.id,{
  attributes: ['id', 'url', 'preview']
})

res.json(newImg)
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
  if(!group){ res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })}
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
  }
  if(existingMembership){

    const status = existingMembership.dataValues.status
    if(status === 'member'){
    res.status(400).json({
      "message": "User is already a member of the group",
      "statusCode": 400
    })
  }
  if(status === 'co-host'){
    res.status(400).json({
      "message": "User is already a member of the group",
      "statusCode": 400
    })
  }
  if(status === 'pending'){
    res.status(400).json({
        "message": "Membership has already been requested",
        "statusCode": 400
      })
  }};
  const newMember = await Membership.create({memberId: user.id, groupId: groupsId, status: 'pending'});

  const response = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId: groupsId
    },
    attributes: {
      exclude: ['updatedAt', 'createdAt']
    }
  })
  res.json(response)
})

//Get All Members of a Group based on the Group's id
router.get('/:id/members', async (req, res) => {
  const newId = req.params.id
  const user = req.user

  let group = await Group.findByPk(newId);
  //console.log(user.id)

  if(!group){
    res.status(404).json({
      "message": "Group couldn't be found",
      "statusCode": 404
    })
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
    return res.status(404).json({
      "message": "Group couldn't be found",
      "statusCode": 404
    });
   }if(user.id === editGroup.organizerId){
    editGroup.update({
        name,
        about,
        type,
        private,
        city,
        state
    })

    const newGroup = await Group.findByPk(editGroup.dataValues.id,{
      attributes: {
        exclude: ['previewImage']
      }
    })
    res.json(newGroup)
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
const existingMember = await User.findByPk(memberId)
const membership = await Membership.findOne({
  where:{
    groupId: groupsId,
    memberId
  }
})

if(!membership){
  res.status(404).json({
    "message": "Membership does not exist for this User",
    "statusCode": 404
  })
}

if(!existingMember){
  res.status(400).json({
    "message": "Validation Error",
    "statusCode": 400,
    "errors": {
      "memberId": "User couldn't be found"
    }
  })
}
const group = await Group.findByPk(groupsId)

if(!group){
  res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
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
  res.json({
    "message": "Successfully deleted membership from group"
  })
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
    res.status(404).json({
      "message": "Group couldn't be found",
      "statusCode": 404
    })
  }
  if(user.id !== selectGroup.dataValues.organizerId){
    res.status(400).json({Error: 'You do not have permission to delete group'})
  }else{
    await selectGroup.destroy()
    res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
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
    //group: ['Group.id']
  });

  const groups = await Membership.findAll({
    where: {
      memberId: user.id
    },
    //attributes: ['groupId']
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
      },
      {
        model: Venue,
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      }
    ],
    raw: true
  });
  //console.log(group)
  if(!group.id){
  return res.status(404).json({
    "message": "Group couldn't be found",
    "statusCode": 404
  })
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
  const result = await Group.findOne({
    where: {
      id: newGroup.dataValues.id
    },
    attributes: {
      exclude: ['previewImage']
    }
  })
  res.json(result)
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
