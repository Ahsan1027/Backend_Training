import express from 'express';

import {
  ForgotPassword,
  LoginUser,
  RegisterUser,
  ResetPassword,
  UpdateVerificationStatus
} from '../controllers/auth';
import dashboardAdminRouter from './dashboard';
import nonauth from './non-authenticated-routes';
import ordersAdminRouter from './orders';
import productsAdminRouter from './products';
import cartAddressRouter from './address';
import cartPaymentRouter from './payment';
import notification from './notification';

import passport from '../middlewares/passport';

const router = express.Router();

router.use('/dashboard', dashboardAdminRouter);
router.use('/order', ordersAdminRouter);
router.use('/prod', productsAdminRouter);
router.use('/cartAddress', cartAddressRouter);
router.use('/cartPayment', cartPaymentRouter);
router.use('/notification', notification);
router.post('/auth/signup', RegisterUser);
router.post('/auth/login', LoginUser);
router.post('/auth/forgot-password', ForgotPassword);
router.put('/auth/user-verifying',passport.authenticate('jwt', { session: false }), UpdateVerificationStatus);
router.post('/auth/new-password', passport.authenticate('jwt', { session: false }), ResetPassword);
router.use(nonauth)

export default router;