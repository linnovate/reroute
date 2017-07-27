import express from 'express';
import ruleCtrl from '../controllers/rule.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/rules - Get list of rules */
  .get(ruleCtrl.list)

  /** POST /api/rules - Create new rule */
  .post(ruleCtrl.create)

  .put(ruleCtrl.updatePriority);

router.route('/:ruleId')
  /** GET /api/rules/:ruleId - Get rule */
  .get(ruleCtrl.get)

  /** PUT /api/rules/:ruleId - Update rule */
  .put(ruleCtrl.update)

  /** DELETE /api/rules/:ruleId - Delete rule */
  .delete(ruleCtrl.remove);

/** Load rule when API with ruleId route parameter is hit */
router.param('ruleId', ruleCtrl.load);

export default router;
