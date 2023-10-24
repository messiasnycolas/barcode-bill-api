import { Request, Response } from 'express';
import { billService } from '../services/bill.service';

export const billController = {
    getBillInformation,
};

async function getBillInformation(req: Request, res: Response): Promise<void> {
    try {
        const lineCode = req.params.lineCode
        if (!lineCode) throw new Error('Empty line code.');

        const billInformation = billService.getBillInformation(lineCode);

        res.status(200).send(billInformation);
    } catch (error) {
        if (error instanceof Error) res.status(400).send(error.message);
        else res.status(400).end();
    }
}