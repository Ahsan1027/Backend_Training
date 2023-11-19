import express from 'express';

import {
  CreateNewCustomer,
  UpdateOrderStatus,
  GetCustomerCards
} from '../controllers/payment/index';

const router = express.Router();

router.post('/create-customer', CreateNewCustomer);
router.post('/update-order-status', UpdateOrderStatus);
router.get('/get-all-cards', GetCustomerCards);

export default router;