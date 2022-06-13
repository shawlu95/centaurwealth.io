import express from 'express';

import { currentUser } from '@shawtickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // if undefined, send back null
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
