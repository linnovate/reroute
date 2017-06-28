import express from 'express';
import testRulesCtrl from '../controllers/testRules.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(testRulesCtrl.test);

export default router;
