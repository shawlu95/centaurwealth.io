import express from 'express';

import { authenticate } from '@bookkeeping/common';

const router = express.Router();

router.get('/api/auth/currentuser', authenticate, (req, res) => {
  // if undefined, send back null
  return res.send({ currentUser: req.user || null });
});

export { router as currentUserRouter };
