import express from 'express';

import { ReadNotification } from '../controllers/notification/read-notification'
import { GetNotification } from '../controllers/notification/get-notification';

import passport from '../middlewares/passport';

const router = express.Router();

router.put('/read-notification', passport.authenticate('jwt', { session: false }), ReadNotification);
router.get('/get-notification/:email', passport.authenticate('jwt', { session: false }), GetNotification);

export default router;