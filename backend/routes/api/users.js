const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors, validateSignup } = require('../../utils/validation');



router.post('/', validateSignup, async (req, res) => {
      const { email, password, firstName, lastName, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const user = await User.create({ email, username, firstName, lastName, hashedPassword });

      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);

router.get('/current', requireAuth, async (req, res) => {
  const user = req.user;

  const currentUser = await User.findOne(
    {
      where: {id: user.id}
    }
    )

  res.json(currentUser)
})

module.exports = router;
