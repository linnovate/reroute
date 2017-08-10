import Trigger from '../models/trigger.model';

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
    value: req.body.newValue
  });

  trigger.save()
    .then(savedTrigger => res.json(savedTrigger))
    .catch(e => next(e));
}

function update(req, res, next) {
  const trigger = req.trigger;
  trigger.description = req.body.description;

  trigger.save()
    .then(savedTrigger => res.json(savedTrigger))
    .catch(e => next(e));
}

export default { load, list, create, update };
