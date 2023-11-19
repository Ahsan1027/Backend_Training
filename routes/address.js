import express from 'express';

import {
  AddAddress,
  GetAddress
} from '../controllers/address/index'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-address', passport.authenticate('jwt', { session: false }), AddAddress);
router.get('/get-address', passport.authenticate('jwt', { session: false }), GetAddress);

export default router;