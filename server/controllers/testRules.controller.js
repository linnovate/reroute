import RuleEngine from 'node-rules';
import Rule from '../models/rule.model';

function test(req, res, next) {
  Rule.list({ type: 'upsales' })
    .then((rules) => {
      const rulesArr = JSON.stringify(rules);
      const inputObject = {};
      inputObject.fact = req.body;
      inputObject.actions = [];
      const R = new RuleEngine();
      R.fromJSON(rulesArr);
      R.execute(inputObject, (result) => {
        res.json(result.actions);
      });
    })
    .catch(e => next(e));
}


export default { test };


