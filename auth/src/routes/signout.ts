import express from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
  return res.status(StatusCodes.OK).send();
});

export { router as signoutRouter };
