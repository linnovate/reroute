import express from 'express';
import iconsCtrl from '../controllers/icons.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/')
  .get(iconsCtrl.load)

  .post(iconsCtrl.update);

router.route('/copy')
  .post(iconsCtrl.copy);

router.route('/pax')
  .get(iconsCtrl.loadPaxValues);



export default router;
