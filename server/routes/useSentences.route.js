import express from 'express';
import useSentencesCtrl from '../controllers/useSentences.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(useSentencesCtrl.get);

export default router;
