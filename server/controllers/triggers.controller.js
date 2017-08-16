import async from 'async';
import _ from 'lodash';
import Trigger from '../models/trigger.model';
import Reservation from '../models/reservation.model';

function load(req, res, next, id) {
  Trigger.get(id)
    .then((trigger) => {
      req.trigger = trigger; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Trigger.list({ limit, skip })
    .then(triggers => res.json(triggers))
    .catch(e => next(e));
}

function create(req, res, next) {
  const trigger = new Trigger({
    description: req.body.description,
  });
  if (req.body.newValue !== null) {
    trigger.value = req.body.newValue;
  }
  if (req.body.showMultiple !== null) {
    trigger.showMultiple = req.body.showMultiple;
  }
  trigger.save()
    .then(savedTrigger => res.json(savedTrigger))
    .catch(e => next(e));
}

function update(req, res, next) {
  const trigger = req.trigger;
  if (req.body.newValue !== null) {
    trigger.value = req.body.newValue;
  }
  if (req.body.showMultiple !== null) {
    trigger.showMultiple = req.body.showMultiple;
  }
  trigger.save()
    .then(savedTrigger => res.json(savedTrigger))
    .catch(e => next(e));
}

function test(req, res, next) {
  Trigger.list().then((triggers) => {
    async.parallel([
      (callback) => {
        const trigger = _.find(triggers, r => r.description === 'resInTheLastHours');
        if (!trigger) callback(null, null);
        else {
          const start = new Date(new Date().getTime() - (trigger.value * 60 * 1000));
          Reservation.find({ createdAt: { $gte: start } }).exec().then((result) => {
            if (result.length > 0) {
              callback(null, 'הזמנה בוצעה');
            } else callback(null, null);
          })
            .catch(e => next(e));
        }
      },
      (callback) => {
        const trigger = _.find(triggers, r => r.description === 'peopleBookedInThePastHour');
        if (!trigger) callback(null, null);
        else {
          const start = new Date(new Date().getTime() - (60 * 60 * 1000));
          Reservation.find({ createdAt: { $gte: start } }).exec().then((result) => {
            if (result.length >= trigger.value) {
              callback(null, `${result.length} אנשים הזמינו בשעה האחרונה`);
            } else callback(null, null);
          })
            .catch(e => next(e));
        }
      },
      (callback) => {
        const trigger = _.find(triggers, r => r.description === 'peopleBookedInThePast24');
        if (!trigger) callback(null, null);
        else {
          const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
          Reservation.find({ createdAt: { $gte: start } }).exec().then((result) => {
            if (result.length >= trigger.value) {
              callback(null, `${result.length} אנשים הזמינו ב24 שעות אחרונות`);
            } else callback(null, null);
          })
            .catch(e => next(e));
        }
      }
    ],
      (err, results) => {
        const arr = [];
        _.forEach(results, (q) => {
          if (q) {
            arr.push({ sentence: q });
          }
        });
        res.json(arr);
      });
  })
    .catch(e => next(e));
}

export default { load, list, create, update, test };
