import express from 'express';

import { CreateNewCustomer } from '../controllers/payment/create-customer';
import { UpdateOrderStatus } from '../controllers/payment/update-order-status';
import { GetCustomerCards } from '../controllers/payment/get-payments';

// import passport from '../middlewares/passport';

const router = express.Router();

router.post('/create-customer', CreateNewCustomer);
router.post('/update-order-status', UpdateOrderStatus);
router.get('/get-all-cards', GetCustomerCards);

export default router;