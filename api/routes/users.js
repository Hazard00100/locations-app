const express           = require('express');
const router            = express.Router();
const knex              = require('../db/db');
const bcrypt            = require('bcryptjs');
const message           = require('../3rdParty/message/message');
const {
  isAuthenticated,
  encode,
  decode,
}                       = require('../3rdParty/auth/auth');

router.post('/sign-up', async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    dob,
    driverLincense,
   } = req.body;
   console.log(
    firstName,
    lastName,
    username,
    password,
    dob,

   )
  if (!password || !username) {
    res.status(401).json(message.user[406]);
  }
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    const alreadyUser = await knex('users').where({ username }).first();

    if (alreadyUser && alreadyUser.username === username) {
      res.status(401).json(message.user[405]);
    }
    console.log('TRy insert to Db here ')
    const user = await knex('users').insert({
      /*firstname: firstName,
      lastname: lastName,
      dob: dob.toString(),
      driverlincense: driverLincense,*/
      username,
      password: hash
     }).returning('*');

    console.log(' done insert this user to DB ', user.id);
    delete user.password;
    delete user.driverlincense;
    res.json({ success: true, token: encode(user[0]), ...user[0] });
  } catch (err) {
    res.status(500).json(message.general[500]);
  }
});

router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    res.status(401).json(message.user[406]);
  }

  try {
    const user = await knex('users').where({ username }).first();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Incorrect password');
    }
    delete user.password;
    res.json({ success: true, token: encode(user), ...user });
  } catch (err) {
    console.log('err', err);
    res.status(500).json(message.general[500]);
  }
});

router.get('/user', isAuthenticated, (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  })
});

module.exports = router;
