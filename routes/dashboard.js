import express from 'express';

import { GetStats } from '../controllers/dashboard/index'

import passport from '../middlewares/passport';

const router = express.Router();

router.get('/stat', passport.authenticate('jwt', { session: false }), GetStats);

export default router;