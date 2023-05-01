const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const eventsRouter = require('./events')
const venuesRouter = require('./venues')
const eventImageRouter = require('./eventImages');
const groupImagesRouter = require('./groupImages')
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/events', eventsRouter);
router.use('/venues', venuesRouter);
router.use('/event-images', eventImageRouter);
router.use('/group-images', groupImagesRouter);



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
