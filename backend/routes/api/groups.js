const express = require('express')
const router = express.Router();

require('dotenv').config();
require('express-async-errors');

const { Group, User, Membership } = require('../../db/models');

router.use(express.json());



router.get('/:id', async (req, res) => {
    const newId = req.params.id
    const groupById = await Group.findOne({
        where: {id: newId}
    });
    const count = await Membership.count({
        where: {
            groupId: newId,
        }
    })
    res.json({groupById, numMembers: count })
}),

router.get('/', async (req, res)=>{
    const allGroups = await Group.findAll();
    console.log(allGroups)
    res.json(allGroups)
}),


module.exports = router
