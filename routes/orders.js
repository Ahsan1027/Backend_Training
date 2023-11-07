import express from 'express';

import { AddOrders } from '../controllers/orders/add-orders'
import { DeleteOrders } from '../controllers/orders/delete-orders'
import { GetOrders } from '../controllers/orders/get-orders'
import { OrdersDelivered } from '../controllers/orders/mark-delivered-orders'
import { GetStats } from '../controllers/orders/get-orders-stats'
import { GetOrderDetail } from '../controllers/orders/get-order-details';

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-order', passport.authenticate('jwt', { session: false }), AddOrders);
router.delete('/delete-order/:orderId', DeleteOrders);
router.get('/get-order', passport.authenticate('jwt', { session: false }), GetOrders);
router.get('/get-order-detail/:orderId', passport.authenticate('jwt', { session: false }), GetOrderDetail);
router.post('/add-delivery', passport.authenticate('jwt', { session: false }), OrdersDelivered);
router.get('/stat', passport.authenticate('jwt', { session: false }), GetStats);

export default router;