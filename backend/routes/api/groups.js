const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

require('dotenv').config();
require('express-async-errors');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Group, User, Membership, Image, Event, sequelize, Sequelize} = require('../../db/models');

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
]

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

//Get Details of a Group from an Id
router.get('/:id', async (req, res) => {
  const groupId = req.params.id;

  const group = await Group.findAll(
    {where: {id: groupId},
      include:{
        model: Image
      } ,
      include:{
        model: User,
        through: {attributes: []}
      }}
  )
  res.json(group)
})
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
