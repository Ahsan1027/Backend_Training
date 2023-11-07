import express from 'express';

import { AddProduct } from '../controllers/products/add-products'
import { DeleteProduct } from '../controllers/products/delete-products'
import { EditProduct } from '../controllers/products/edit-products'
import { GetAllProducts } from '../controllers/products/get-products'
import { ImportBulkProducts } from '../controllers/products/import-bulk-products'

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/add-prod', passport.authenticate('jwt', { session: false }), AddProduct);
router.delete('/delete-prod/:productId', passport.authenticate('jwt', { session: false }), DeleteProduct);
router.put('/edit-prod/:productId', passport.authenticate('jwt', { session: false }), EditProduct);
router.post('/import-bulk', passport.authenticate('jwt', { session: false }), ImportBulkProducts);
router.get('/get-prod', GetAllProducts);

export default router;