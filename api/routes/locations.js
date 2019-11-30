const express                   = require('express');
const router                    = express.Router();
const knex                      = require('../db/db');
const message                   = require('../3rdParty/message/message');
const ggMap                     = require('../3rdParty/ggMap');
const { isAuthenticated }       = require('../3rdParty/auth/auth');
const { emitApprovePlace }      = require('../3rdParty/Socket/index');
/*const { up, down } = require('../db/migrations/20170627190837_users');*/

const map = new ggMap();
const RADIUS = 20000;

/** Api get data from lat, lng and type, radius **/
router.put('/handle-with-lat-lng', isAuthenticated, async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.userData.id;
  console.log(' lat, lng ',lat, lng, userId);

  if (!lat || !lng) {
    res.status(401).json(message.location[401]);
  }

  if (!userId) {
    res.status(401).json(message.user[401]);
  }

  try {
    const
    placeType = await knex.select().table('typeOfPlace'),
    dStatus = await knex.select().table('status'),
    arrayCall = [];

    if (!placeType || placeType.length === 0) {
      res.json({ success: false, tpt2213: 'ERROR', data: [] });
    }

    placeType.map(async type => {
      const data = await map.place().initD(lat, lng, RADIUS, type.name).searchNearBy();
      console.log('data.length ', data.length);
      if (!data || data.length === 0) {
        return resolve(0);
      }
      return data.map(async ({
        name,
        geometry: {location},
        vicinity,
        icon,
        id,
        place_id
      }) => {
        const lItem = {
          name,
          point: knex.raw(`POINT (${location.lat}, ${location.lng})`),
          address: vicinity,
          typeOfPlaceId: type.id,
          statusId: (dStatus.find(d => d.name === 'pending') || {id: 3}).id,
          userId
        };
          arrayCall.push(lItem);
          const rLItem = await knex('locations').insert(lItem).returning('*');
          console.log(' ============= insert this to db ============= ', rLItem);
        });
    });
    res.json({ success: true, tpt2213: 'OK', data: arrayCall });
  } catch (err) {
    console.log('err', err);
    res.status(500).json(message.general[500]);
  }
});

/** CHANGE STATUS OF PLACE **/
router.put('/change-status-of-place', isAuthenticated, async (req, res) => {
  try {
    const user = req.userData;
    const { statusId, id } = req.body; // id of location

    if (!statusId || !id) {
      res.status(401).json(message.location[402]);
    }

    if (!user) {
      res.status(401).json(message.user[401]);
    }

    const status = await knex('status').where('id', '=', statusId).first();
    const up = await knex('locations').where('id', '=', id).update({statusId});

    console.log('status', status);
    /** Emit location from admin to cilent **/
    if (status.name === 'approve') {
      emitApprovePlace({...req.body, statusName: status.name});
    }


    if (up) {
      res.json({ success: true, message: 'Done update status' });
    } else {
      res.status(500).json(message.general[500]);
    }
  } catch(ex) {
    console.log(ex);
    res.status(500).json(message.general[500]);
  }
});

/** GET DATA FOR ADMIN **/
router.get('/data-lat-lng', isAuthenticated, async (req, res) => {
  const
    isAdmin = req.userData.admin,
    dStatus = await knex.select().table('status');
  let data = [];
  try {
    if (!isAdmin) {
      data = await knex('locations').where({
        statusId: dStatus.find(d => d.name === 'approve').id,
        userId: req.userData.id
      });
    } else {
      data = await knex.select().table('locations');
    }

    res.json({ success: true, tpt2213: 'OK', data });
  } catch (ex) {
    console.log('ex', ex);
    res.status(500).json(message.general[500]);
  }
});

router.get('/list-status-of-place', isAuthenticated, async (req, res) => {
  const data = await knex.select().table('status');
  res.json({ success: true, tpt2213: 'OK', data });
});

router.get('/list-place', isAuthenticated, async (req, res) => {
  const data = await knex.select().table('typeOfPlace');
  res.json({ success: true, tpt2213: 'OK', data });
});

module.exports = router;