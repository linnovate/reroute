import _ from 'lodash';
import IconsMatrix from '../models/icons.model';

function test(req, res, next) {
  const pax = getPax(req.body.adults, req.body.children, req.body.infants);
  IconsMatrix.getByHotelPax(req.body.hotelID, pax)
  .then((result) => {
    const availableRooms = _.filter(result, (o) => {
      const a = _.find(req.body.rooms, r => r.roomCategory === o.roomCategory);
      return a.available;
    });
    const roomsIcons = [];
    _.forEach(availableRooms, (item) => {
      _.forEach(item.icons, (val) => {
        const find = _.find(roomsIcons, i => i.icon.name === val.name);
        if (!find) {
          roomsIcons.push({ roomCategory: item.roomCategory, icon: val });
          return false;
        }
      });
    });
    res.json(roomsIcons);
  })
 .catch(e => next(e));
}

function getPax(adults, children, infants) {
  if (infants > 0) return 'withBabies';
  if (children > 0) return 'family';
  if (adults > 2) return 'moreThan2';
  if (adults === 2) return 'double';
  return 'single';
}


export default { test };
