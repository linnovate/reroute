import Reservation from '../models/reservation.model';

function create(req, res, next) {
  const reservation = new Reservation({
    masterID: req.body.masterID,
  });

  reservation.save()
    .then(savedRes => res.json(savedRes))
    .catch(e => next(e));
}

export default { create };
