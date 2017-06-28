import RuleEngine from 'node-rules';
import Rule from '../models/rule.model';

function test(req, res, next) {
  Rule.list()
    .then((rules) => {
      const rulesArr = JSON.stringify(rules);
      const inputObject = {};
      inputObject.fact = {
        name: 'user4',
        checkin: new Date(2017, 6, 16),
        checkout: new Date(2017, 6, 18),
        nationality: 'tourist',
        transactionTotal: -1
      };
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


