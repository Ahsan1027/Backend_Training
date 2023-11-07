import express from 'express';

import { AddPayment } from '../controllers/user/get-payments'
import { CreateNewCustomer } from '../controllers/payments/create-customer';
import { CreateCharges } from '../controllers/payments/create-charges';

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-payment', passport.authenticate('jwt', { session: false }), AddPayment);
router.post('/create-customer', CreateNewCustomer);
router.post('/create-charges', CreateCharges);

export default router;