import express from 'express';

import {
  AddProduct,
  DeleteProduct,
  EditProduct,
  GetAllProducts,
  ImportBulkProducts
} from '../controllers/products/index'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-prod', passport.authenticate('jwt', { session: false }), AddProduct);
router.delete('/delete-prod/:productId', passport.authenticate('jwt', { session: false }), DeleteProduct);
router.put('/edit-prod/:productId', passport.authenticate('jwt', { session: false }), EditProduct);
router.post('/import-bulk', passport.authenticate('jwt', { session: false }), ImportBulkProducts);
router.get('/get-prod', GetAllProducts);

export default router;