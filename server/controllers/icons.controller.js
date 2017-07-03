import _ from 'lodash';
import IconsMatrix from '../models/icons.model';

function load(req, res, next) {
  IconsMatrix.getByHotel(req.params.hotelId)
    .then((iconsMatrix) => {
      if (iconsMatrix.length) {
        const roomMatrix = _.find(iconsMatrix, o => o.matrixType === 'room');
        const suiteMatrix = _.find(iconsMatrix, o => o.matrixType === 'suite');
        return res.json({ iconsMatrix: { roomMatrix, suiteMatrix } });
      }

      const roomMatrix = new IconsMatrix({
        hotelId: req.params.hotelId,
        matrixType: 'room',
        matrix: combinations(JSON.parse(req.query.rooms))
      });

      roomMatrix.save()
        .then((savedRoomMatrix) => {
          const suiteMatrix = new IconsMatrix({
            hotelId: req.params.hotelId,
            matrixType: 'suite',
            matrix: combinations(JSON.parse(req.query.suites))
          });

          suiteMatrix.save()
            .then(savedSuiteMatrix => res.json({ iconsMatrix: {
              roomMatrix: savedRoomMatrix, suiteMatrix: savedSuiteMatrix
            } }))
            .catch(e => next(e));
        })
      .catch(e => next(e));
    })
    .catch(e => next(e));
}


function combinations(rooms) {
  const r = [];
  for (let i = 0; i < (1 << rooms.length); i++) {
    const c = [];
    for (let j = 0; j < rooms.length; j++) {
      const obj = {
        pos: { x: i, y: j },
        state: i & (1 << j),
        icon: 'eeee',
        room: rooms[j].name
      };
      c.push(obj);
    }
    r.push(c);
  }
  return r;
}

export default { load };
