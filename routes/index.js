import express from 'express';

import {
  ForgotPassword,
  LoginUser,
  RegisterUser,
  ResetPassword
} from '../controllers/auth';
import dashboardAdminRouter from './dashboard';
import nonauth from './non-authenticated-routes';
import ordersAdminRouter from './orders';
import productsAdminRouter from './products';
import cartAddressRouter from './user-address';
import cartPaymentRouter from './user-payment';
import notification from './notification';

import passport from '../middlewares/passport';

const router = express.Router();

router.use('/dashboard', dashboardAdminRouter);
router.use('/order', ordersAdminRouter);
router.use('/prod', productsAdminRouter);
router.use('/cart', cartAddressRouter);
router.use('/cart', cartPaymentRouter);
router.use('/notification', notification);
router.post('/auth/signup', RegisterUser);
router.post('/auth/login', LoginUser);
router.post('/auth/forgot-password', ForgotPassword);
router.post('/auth/new-password', passport.authenticate('jwt', { session: false }), ResetPassword);
router.use(nonauth)

export default router;