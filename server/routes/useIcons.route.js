import express from 'express';
import useIconsCtrl from '../controllers/useIcons.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(useIconsCtrl.test);

export default router;
