import express from 'express';

import {
  ReadNotification,
  GetNotification
} from '../controllers/notification/index'

import passport from '../middlewares/passport';

const router = express.Router();

router.put('/read-notification', passport.authenticate('jwt', { session: false }), ReadNotification);
router.get('/get-notification/:email', passport.authenticate('jwt', { session: false }), GetNotification);

export default router;