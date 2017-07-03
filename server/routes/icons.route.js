import express from 'express';
import iconsCtrl from '../controllers/icons.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/:hotelId')
  .get(iconsCtrl.load);



export default router;
