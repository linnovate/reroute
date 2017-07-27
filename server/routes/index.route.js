import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import ruleRoutes from './rule.route';
import testRulesRoutes from './testRules.route';
import iconsRoutes from './icons.route';
import useIconsRoutes from './useIcons.route';
import roomRoutes from './room.route';
import useSentencesRoutes from './useSentences.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount rule routes at /rules
router.use('/rules', ruleRoutes);

router.use('/use-upsales', testRulesRoutes);

router.use('/use-sentences', useSentencesRoutes);

router.use('/icons', iconsRoutes);

router.use('/use-icons', useIconsRoutes);

router.use('/rooms', roomRoutes);

export default router;
