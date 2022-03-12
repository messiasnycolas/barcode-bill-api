import { billInfo } from '../interfaces/billInfo';

export const billService = {
    getBillInformation,
};

async function getBillInformation(lineCode): Promise<billInfo> {
    // do smth...
    const expirationDate = '';
    const amount = '';
    const barCode = '';

    return { barCode, expirationDate, amount }
}