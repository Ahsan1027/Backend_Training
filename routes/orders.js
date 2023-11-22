import express from 'express';

import {
  AddOrders,
  GetOrders,
  OrdersDelivered,
  GetStats,
  GetOrderDetail
} from '../controllers/orders/index'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-order', passport.authenticate('jwt', { session: false }), AddOrders);
router.get('/get-order', passport.authenticate('jwt', { session: false }), GetOrders);
router.get('/get-order-detail/:orderId', passport.authenticate('jwt', { session: false }), GetOrderDetail);
router.post('/add-delivery', passport.authenticate('jwt', { session: false }), OrdersDelivered);
router.get('/stat', passport.authenticate('jwt', { session: false }), GetStats);

export default router;