import _ from 'lodash';
import async from 'async';
import Room from '../models/room.model';

function load(req, res, next) {
  Room.getByHotel(req.query.hotelID)
    .then((result) => {
      if (result.length) {
        return res.json(result);
      }
      let rooms = JSON.parse(req.query.rooms);
      rooms = _.filter(rooms, o => o.name !== '');
      async.forEachOf(rooms, (value, key, callback) => {
        const room = new Room({
          hotelID: req.query.hotelID,
          roomCategory: value.roomCategory,
          roomName: value.name,
          weight: key
        });
        room.save((err, item) => {
          if (err) {
            console.log(err);
          }
          console.log('Saved', item);
          callback();
        });
      }, (error) => {
        if (error) res.json({ error });
        return Room.getByHotel(req.query.hotelID)
          .then(savedRooms => res.json(savedRooms))
          .catch(e => next(e));
      });
    })
    .catch(e => next(e));
}

function update(req, res, next) {
  const rooms = req.body.rooms;

  async.forEachOf(rooms, (value, key, callback) => {
    Room.get(value._id)
      .then((roomRes) => {
        const room = roomRes;
        room.weight = key;

        return room.save()
          .then(() => callback())
          .catch(e => callback(e));
      })
      .catch(e => callback(e));
  }, (err) => {
    if (err) next(err.message);

    Room.getByHotel(rooms[0].hotelID)
      .then(result => res.json(result))
      .catch(e => next(e));
  });
}

export default { load, update };
