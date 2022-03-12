import { Router } from 'express';
import { billController } from '../controllers/bill.controller';

export const billRouter = Router();

billRouter.get('/:lineCode', billController.getBillInformation);