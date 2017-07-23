import async from 'async';
import _ from 'lodash';
import IconsMatrix from '../models/icons.model';


function load(req, res, next) {
  IconsMatrix.getByHotelPax(req.query.hotelID, req.query.pax)
    .then((iconsMatrix) => {
      if (iconsMatrix.length) {
        return res.json(iconsMatrix);
      }
      let rooms = JSON.parse(req.query.rooms);
      rooms = _.filter(rooms, o => o.name !== '');
      async.forEachOf(rooms, (value, key, callback) => {
        const roomMatrix = new IconsMatrix({
          hotelID: req.query.hotelID,
          roomCategory: value.roomCategory,
          roomName: value.name,
          pax: req.query.pax,
          icons: [],
          weight: key
        });
        roomMatrix.save((err, item) => {
          if (err) {
            console.log(err);
          }
          console.log('Saved', item);
          callback();
        });
      }, (error) => {
        if (error) res.json({ error });
        return IconsMatrix.getByHotelPax(req.query.hotelID, req.query.pax)
          .then(savedRooms => res.json(savedRooms))
          .catch(e => next(e));
      });
    })
    .catch(e => next(e));
}

function update(req, res, next) {
  const rooms = req.body.rooms;

  async.forEachOf(rooms, (value, key, callback) => {
    IconsMatrix.get(value._id)
      .then((roomRes) => {
        const room = roomRes;
        room.weight = key;
        room.icons = value.icons;

        return room.save()
          .then(() => callback())
          .catch(e => callback(e));
      })
      .catch(e => callback(e));
  }, (err) => {
    if (err) next(err.message);

    IconsMatrix.getByHotelPax(rooms[0].hotelID, rooms[0].pax)
      .then(iconsMatrix => res.json(iconsMatrix))
      .catch(e => next(e));
  });
}

function copy(req, res, next) {
  const rooms = req.body.rooms;
  IconsMatrix.getByHotelPax(req.body.hotelID, req.body.pax)
    .then((iconsMatrix) => {
      if (iconsMatrix.length) {
        async.each(iconsMatrix, (value, callback) => {
          const room = _.find(rooms, r => r.roomCategory === value.roomCategory);
          const val = value;
          val.weight = room.weight;
          val.icons = room.icons;
          val.save()
            .then(() => callback())
            .catch(e => callback(e));
        }, (err) => {
          if (err) next(err.message);

          IconsMatrix.getByHotelPax(req.body.hotelID, req.body.pax)
            .then(result => res.json(result))
            .catch(e => next(e));
        });
      } else {
        async.each(rooms, (value, callback) => {
          const roomMatrix = new IconsMatrix({
            hotelID: value.hotelID,
            roomCategory: value.roomCategory,
            roomName: value.roomName,
            pax: req.body.pax,
            icons: value.icons,
            weight: value.key
          });
          roomMatrix.save()
            .then(() => callback())
            .catch(e => callback(e));
        }, (err) => {
          if (err) next(err.message);
          IconsMatrix.getByHotelPax(req.body.hotelID, req.body.pax)
            .then(result => res.json(result))
            .catch(e => next(e));
        });
      }
    })
    .catch(e => next(e));
}

function loadPaxValues(req, res) {
  return res.json(['single', 'double', 'moreThan2', 'family', 'withBabies']);
}

export default { load, update, loadPaxValues, copy };
