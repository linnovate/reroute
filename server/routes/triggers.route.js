import express from 'express';
import triggersCtrl from '../controllers/triggers.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/')
  .get(triggersCtrl.list)

  .post(triggersCtrl.create);

router.route('/:triggerId')

  .put(triggersCtrl.update);

router.param('triggerId', triggersCtrl.load);

export default router;
