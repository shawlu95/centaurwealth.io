import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.patch('/api/account', async (req: Request, res: Response) => {
  console.log('update account');
  return res.status(StatusCodes.OK).send();
});

export { router as accountUpdate };
