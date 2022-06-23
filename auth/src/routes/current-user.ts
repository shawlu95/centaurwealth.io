import express from 'express';

import { currentUser } from '@bookkeeping/common';

const router = express.Router();

router.get('/api/auth/currentuser', currentUser, (req, res) => {
  // if undefined, send back null
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
