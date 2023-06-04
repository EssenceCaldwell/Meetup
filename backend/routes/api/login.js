const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { handleValidationErrors, validateLogin} = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();



router.post('/', validateLogin, async (req, res, next) => {
      const { username, email, password } = req.body;

let user

  if(username){
     user = await User.unscoped().findOne({
    where: {
        username: username
      }
    })
  }
  console.log(user)
  if(email){
     user = await User.unscoped().findOne({
      where: {
          email: email
        }
      })
    }
    if(!email && !username){
      res.status(400).json({Error: "Please provide a valid email or username."})
    }

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

  router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  router.get('/', (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
        return res.json({user: safeUser});
      } else return res.json({ user: null });
    }
  );



module.exports = router;
