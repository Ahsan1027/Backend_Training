import express from 'express';

import auth from './auth';
import dashboardAdminRouter from './dashboard';
import nonauth from './non-authenticated-routes';
import ordersAdminRouter from './orders';
import productsAdminRouter from './products';
import cartAddressRouter from './address';
import cartPaymentRouter from './payment';
import notification from './notification';

const router = express.Router();

router.use('/dashboard', dashboardAdminRouter);
router.use('/order', ordersAdminRouter);
router.use('/prod', productsAdminRouter);
router.use('/cartAddress', cartAddressRouter);
router.use('/cartPayment', cartPaymentRouter);
router.use('/notification', notification);
router.use('/auth', auth)
router.use(nonauth)

export default router;