import express from 'express';

import {
  ForgotPassword,
  LoginUser,
  RegisterUser,
  ResetPassword,
  UpdateVerificationStatus
} from '../controllers/auth';

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/signup', RegisterUser);
router.post('/login', LoginUser);
router.post('/forgot-password', ForgotPassword);
router.put('/user-verifying', passport.authenticate('jwt', { session: false }), UpdateVerificationStatus);
router.post('/new-password', passport.authenticate('jwt', { session: false }), ResetPassword);

export default router;

