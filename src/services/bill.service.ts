import { billInfo } from '../interfaces/billInfo';
import { parse, format, addDays } from 'date-fns';
export const billService = {
    getBillInformation,
};

function getBillInformation(lineCode: string): billInfo | null {
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
    validateBlocks(lineCode, 'title');

    const barCodeValidator = lineCode[32];
    const expirationFactor = lineCode.substring(33, 37);
    const rawAmount = lineCode.substring(37, 47);

    const barCode = lineCode.substring(0, 4)
        .concat(
            barCodeValidator,
            expirationFactor,
            rawAmount,
            lineCode.substring(4, 9),
            lineCode.substring(10, 20),
            lineCode.substring(21, 31)
        );

    validateBarCode(barCode, 'title');
    const amount = getAmount(rawAmount);
    const expirationDate = getExpirationDate(expirationFactor);

    return { barCode, expirationDate, amount };
}

export function extractConvenantBillInfo(lineCode: string): billInfo {
    validateBlocks(lineCode, 'convenant');
    const barCode = lineCode.substring(0, 11)
        .concat(
            lineCode.substring(12, 23),
            lineCode.substring(24, 35),
            lineCode.substring(36, 47)
        );

    validateBarCode(barCode, 'convenant');
    const amount = getAmount(barCode.substring(4, 15));
    const expirationDate = '';

    return { amount, expirationDate, barCode };
}

export function validateBlocks(lineCode: string, type: billType): void {
    const blocks: string[] = [];
    const indexes: [number, number][] = type === 'convenant'
        ? [[0, 12], [12, 24], [24, 36], [36, 48]]
        : [[0, 10], [10, 21], [21, 32]];

    blocks.push(
        ...indexes.map(([start, end]: [number, number]) => lineCode.substring(start, end)),
    );

    blocks.map((block) => {
        if (!blockIsValid(block)) throw new Error('Invalid block detected.');
    });
}

export function blockIsValid(block: string) {
    const blockArray = block.split('').reverse();

    const foundValidator = blockArray.shift();
    const calculatedValidator = getMod10Validator(blockArray);

    return foundValidator === calculatedValidator;
}

export function getMod10Validator(blockArray: string[]): string {
    let blockSum = 0;
    for (let i = 0; i < blockArray.length; i++) {
        const multiplier = (i + 1) % 2 ? 2 : 1;
        const indexMultiplied = +blockArray[i] * multiplier;

        blockSum += indexMultiplied > 9
            ? sumDigits(indexMultiplied)
            : indexMultiplied;
    }

    const blockValidator = Math.ceil((blockSum + 1) / 10) * 10 - (blockSum % 10);
    return blockValidator > 9
        ? String(blockValidator).slice(-1)
        : String(blockValidator);
}

export function sumDigits(num: number): number {
    return (+String(num)[0]) + (+String(num)[1]);
}

export function validateBarCode(barCode: string, type: billType): void {
    const [foundValidator, barCodeArray] = type === 'convenant'
        ? [barCode[3], barCode.replace(/(\d{3})(\d)(\d*)/, '$1$3').split('').reverse()]
        : [barCode[4], barCode.replace(/(\d{4})(\d)(\d*)/, '$1$3').split('').reverse()];

    const calculatedValidator = type === 'convenant'
    ? getMod10Validator(barCodeArray)
    : getMod11Validator(barCodeArray);

    if (foundValidator !== calculatedValidator)
        throw new Error('Generated bar code is invalid. Check the line code.');
}

export function getMod11Validator(barCodeArray: string[]): string {
    let barCodeSum = 0;
    for (let i = 0, multiplier = 2; i < barCodeArray.length; i++, multiplier++) {
        if (multiplier > 9) multiplier = 2;
        barCodeSum += +barCodeArray[i] * multiplier;
    }

    const calculatedValidator = 11 - (barCodeSum % 11);

    switch (calculatedValidator) {
        case 0:
        case 10:
        case 11:
            return '1';
        default:
            return String(calculatedValidator);
    }
}

export function getAmount(rawAmount: string): string {
    return rawAmount.slice(0, -2)
        .concat('.', rawAmount.slice(-2))
        .replace(/(0*)(.*)/, '$2');
}

export function getExpirationDate(expirationFactor: string): string {
    const baseDate = parse('1997-10-07', 'yyyy-MM-dd', new Date());
    const expirationDate = addDays(baseDate, +expirationFactor);
    return format(expirationDate, 'yyyy-MM-dd');
}