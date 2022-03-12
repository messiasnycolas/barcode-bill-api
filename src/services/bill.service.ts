import { billInfo } from '../interfaces/billInfo';

export const billService = {
    getBillInformation,
};

function getBillInformation(lineCode: string): billType | null {
    if (hasNonNumberCharacters(lineCode)) 
        throw new Error('Invalid line code: Non-number character found.');
    
    const billType = getBillType(lineCode);
    
    if (billType === 'convenant')
    return extractConvenantBillInfo(lineCode);
    else if (billType === 'title')
    return extractTitleBillInfo(lineCode);

    return null;
}

export function hasNonNumberCharacters(lineCode: string): boolean {
    return /[^\d]+/.test(lineCode);
}

type billType = 'title' | 'convenant';

export function getBillType(lineCode: string): billType {
    return lineCode.startsWith('8') && lineCode.length === 48
        ? 'convenant'
        : 'title';
}

export function extractTitleBillInfo(lineCode: string): billInfo {
    // ...
}

export function extractConvenantBillInfo(lineCode: string): billInfo {
    // ...
}