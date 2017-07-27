import express from 'express';
import roomCtrl from '../controllers/room.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/')
  .get(roomCtrl.load)

  .post(roomCtrl.update);

export default router;
