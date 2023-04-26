const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

require('dotenv').config();
require('express-async-errors');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Group, User, Membership, Image, Venue, Event, sequelize, Sequelize} = require('../../db/models');

router.use(express.json());

const validateGroup = [
  check('name')
  .exists({checkFalsy: true})
  .withMessage('Please provide a name'),
  check('about')
  .exists({checkFalsy: true})
  .withMessage("Please provide an about section"),
  check('type')
  .exists({checkFalsy: true})
  .withMessage('Please provide a type'),
  check('private')
  .exists({checkFalsy: true})
  .withMessage('Please state if group is private or public'),
  check('city')
  .exists({checkFalsy: true})
  .withMessage('Please provide a city'),
  check('state')
  .exists({checkFalsy: true})
  .withMessage('Please provide a state'),
  handleValidationErrors
];



//Get all Venues for a Group Specified by Id
router.get('/:id/venues', async (req, res) => {
  const groupsId = req.params.id;

  const venue = await Venue.findAll({
    where: {
      groupId: groupsId
    },
    attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
  });
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
  let groupById = await Group.findOne({
      where: {id: newId},
      include:{
        model: User,
        attributes: ["id", "firstName", "lastName"],
        through: { attributes: ['status'],
      where: {
        status: 'member'
      }
    }
      }
  });
  if(!groupById){
    res.status(404).json({Error: 'This group does not exisit'})
  }if(user.id === groupById.organizerId){
  groupById = await Group.findOne({
    where: {id: newId},
    include:{
      model:User,
      attributes: ['id', 'firstName', 'lastName'],
      through: {attributes: ['status']}
    }
  })
 }
  res.json({groupById })
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

//Delete Group By Id
router.delete('/:groupId', requireAuth, async (req, res) => {
  const groupId = req.params.groupId;
  const user = req.user
  const selectGroup = await Group.findOne({
      where: {
          id: groupId
      }
  });
  if(!selectGroup){
    res.status(404).json({Error: "Group does not exist."})
  }if(user.id === selectGroup.organizerId){
    await selectGroup.destroy()
  }else res.status(404).json({Error: 'You do not have permission to delete group'})
  res.json({message: 'Successfully deleted'})
});

//Get All Groups Joined Or Organized by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const user = req.user;
  const userOrganizer = await Group.findAll({
    where: {
      organizerId: user.id
    },
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
          attributes: ['memberId']
        }
      }
    ],
    group: ['Group.id']
  });

  const userMember = await Group.findAll({
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
            attributes: ['memberId']
          },
          where: {id: user.id}
        }
      ],
      group: ['Group.id']
    });
  res.json({userOrganizer, userMember})
})

//Get Details of a Group from an Id
router.get('/:id', async (req, res) => {
  const groupId = req.params.id;

  const group = await Group.findAll({
    where: {id: groupId},
      include:[
      {
        model: Image,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        through: {attributes: []}
      }
    ]
  });

  if(group.length){
    const organizerId = group[0].organizerId

 const organizer = await User.findOne({
  where: {id: organizerId},
  attributes: ['id', 'firstName', 'lastName']
} )

  res.json({group, organizer})
}else res.status(404).json({Error: 'Group could not be found'})
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
