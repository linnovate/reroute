import express from 'express';
import reservationCtrl from '../controllers/reservation.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(reservationCtrl.create);


export default router;
