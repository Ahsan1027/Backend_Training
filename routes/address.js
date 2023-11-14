import express from 'express';

import { AddAddress } from '../controllers/address/add-address'
import { GetAddress } from '../controllers/address/get-address'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-address', passport.authenticate('jwt', { session: false }), AddAddress);
router.get('/get-address', passport.authenticate('jwt', { session: false }), GetAddress);

export default router;