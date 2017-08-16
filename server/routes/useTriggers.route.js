import express from 'express';
import triggersCtrl from '../controllers/triggers.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(triggersCtrl.test);

export default router;
