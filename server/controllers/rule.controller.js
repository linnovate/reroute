import async from 'async';
import _ from 'lodash';
import Rule from '../models/rule.model';
import regex from '../helpers/ruleBuilder';


/**
 * Load rule and append to req.
 */
function load(req, res, next, id) {
  Rule.get(id)
    .then((rule) => {
      req.rule = rule; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get rule
 * @returns {Rule}
 */
function get(req, res) {
  return res.json(req.rule);
}

/**
 * Create new rule
 * @property {string} req.body.name - The name of rule.
 * @returns {Rule}
 */
function create(req, res, next) {
  const ruleTmp = regex.json2rule(req.body.ruleObj);
  const rule = new Rule({
    name: req.body.ruleName,
    ruleObj: req.body.ruleObj,
    condition: ruleTmp.condition,
    consequence: ruleTmp.consequence,
    _on: true,
    priority: 1,
  });
  rule.save()
    .then(savedRule => res.json(savedRule))
    .catch(e => next(e));
}

/**
 * Update existing rule
 * @property {string} req.body.name - The name of rule.
 * @returns {Rule}
 */
function update(req, res, next) {
  const rule = req.rule;
  const ruleTmp = regex.json2rule(req.body.ruleObj);

  rule.name = req.body.ruleName;
  rule.ruleObj = req.body.ruleObj;
  rule.condition = ruleTmp.condition;
  rule.consequence = ruleTmp.consequence;

  rule.save()
    .then(savedRule => res.json(savedRule))
    .catch(e => next(e));
}

/**
 * Get rule list.
 * @property {number} req.query.skip - Number of rules to be skipped.
 * @property {number} req.query.limit - Limit number of rules to be returned.
 * @returns {Rule[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0, type,
  } = req.query;
  Rule.list({
      limit,
      skip,
      type,
    })
    .then(rules => res.json(rules))
    .catch(e => next(e));
}

/**
 * Delete rule.
 * @returns {Rule}
 */
function remove(req, res, next) {
  const rule = req.rule;
  rule.remove()
    .then(deletedRule => res.json(deletedRule))
    .catch(e => next(e));
}

function updatePriority(req, res, next) {
  const rules = req.body.rules;

  async.forEachOf(rules, (value, key, callback) => {
    Rule.get(value._id)
      .then((ruleRes) => {
        const rule = ruleRes;
        rule.priority = key + 1;

        return rule.save()
          .then(() => callback())
          .catch(e => callback(e));
      })
      .catch(e => callback(e));
  }, (err) => {
    if (err) next(err.message);
    res.send('update success');
  });
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  updatePriority
};
