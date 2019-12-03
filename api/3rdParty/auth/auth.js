const request             = require('request-promise');
const moment              = require('moment');
const jwt                 = require('jwt-simple');
const message             = require('../message/message');
const knex                = require('../../db/db');

function encode(user) {
  delete user.driverlincense;
  const token = {
    exp: moment().add(180, 'days').unix(),
    iat: moment().unix(),
    ...user,
    id: parseInt(user.id, 10)
  };

  return jwt.encode(token, process.env.TOKEN_SECRET);
}

function decode(token, callback) {
  const decodedJwt = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();

  if (now > decodedJwt.exp) {
    if (!callback) {
      return {};
    }
    callback('Token has expired.');
  } else {
    if (!callback) {
      return decodedJwt;
    }
    callback(null, decodedJwt);
  }
}

function isAuthenticated(req, res, next) {
  console.log(' req.headers ', req.headers);
  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).json(message.user[401]);
  }

  const token = req.headers.authorization.split(' ')[1];

  decode(token, async (err, payload) => {
    try {
      if (err) {
        return res.status(401).json(message.user[401]);
      }
      console.log(' done isAuthenticated for user ID  ', payload.id);
      const user = await knex('users').where({ id: payload.id }).first();
      req.userData = user;
      return next();
    } catch (err) {
      console.log('error', err);
      return next(err);
    }
  });
}

module.exports = {
  encode,
  decode,
  isAuthenticated
};
