import express from 'express';

import { AddAddress } from '../controllers/user/add-address'
import { GetAddress } from '../controllers/user/get-address'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-address', passport.authenticate('jwt', { session: false }), AddAddress);
router.get('/get-address', passport.authenticate('jwt', { session: false }), GetAddress);

export default router;