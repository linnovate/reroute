import async from 'async';
import _ from 'lodash';
import IconsMatrix from '../models/icons.model';


function load(req, res, next) {
  IconsMatrix.getByHotelPax(req.query.hotelID, req.query.pax)
    .then((iconsMatrix) => {
      if (iconsMatrix.length) {
        console.log('fffffffffffffffff', iconsMatrix);
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
        console.log('vvvvvvvvvvvvv');
        return IconsMatrix.getByHotelPax(req.query.hotelID, req.query.pax)
        .then(savedRooms => res.json(savedRooms))
        .catch(e => next(e));
      });
    })
    .catch(e => next(e));
}

export default { load };
