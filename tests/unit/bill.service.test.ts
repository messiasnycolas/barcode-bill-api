import { getMod11Validator, getMod10Validator, getAmount, getBillType, getExpirationDate, hasNonNumberCharacters, sumDigits, validateBarCode, validateBlocks } from '../../src/services/bill.service';

describe('hasNonNumberCharacters', () => {
    const letters = 'abcdefghijklmnop';
    const mixed = 'a1b2c3d4e5f6g7h8i9j10';
    const specialMixed = '23131#41231*';
    const spaceMixed = '1231224 3123123';
    const numbers = '1234567890102301';

    it('should return true when there are non number characters in line code', () => {
        expect(hasNonNumberCharacters(letters)).toBeTruthy();
        expect(hasNonNumberCharacters(mixed)).toBeTruthy();
        expect(hasNonNumberCharacters(specialMixed)).toBeTruthy();
        expect(hasNonNumberCharacters(spaceMixed)).toBeTruthy();
        expect(hasNonNumberCharacters(numbers)).toBeFalsy();
    });
});

describe('getBillType', () => {
    const convenantExample = '836900000016294502222028202100000001000019041961';
    const titleExample = '00190000090326892300436016465175889260000014169';

    it('should detect and return bills type', () => {
        expect(getBillType(convenantExample)).toEqual('convenant');
        expect(getBillType(titleExample)).toEqual('title');
    });
});

describe('sumDigits', () => {
    it('should sum the two digits of a number between 9 and 99', () => {
        expect(sumDigits(10)).toEqual(1);
        expect(sumDigits(18)).toEqual(9);
        expect(sumDigits(42)).toEqual(6);
        expect(sumDigits(99)).toEqual(18);
    });
});

describe('getMod10Validator', () => {
    const reverseLineCodeBlock1 = ['0', '0', '0', '0', '0', '9', '1', '0', '0', '0'];
    const reverseLineCodeBlock2 = ['0', '0', '3', '2', '9', '8', '6', '2', '3', '0'];
    const reverseLineCodeBlock3 = ['7', '1', '1', '8', '5', '3', '3', '5', '3', '3'];

    it('should calculate the validator digit from a reverse line code block array', () => {
        expect(getMod10Validator(reverseLineCodeBlock1)).toEqual('9');
        expect(getMod10Validator(reverseLineCodeBlock2)).toEqual('4');
        expect(getMod10Validator(reverseLineCodeBlock3)).toEqual('0');
    });
});

describe('getMod11Validator', () => {
    const reverseBarCodeArr1 = ['7', '1', '5', '6', '4', '6', '1', '0', '6', '3', '0', '0', '3', '2',
        '9', '8', '6', '2', '3', '0', '0', '0', '0', '0', '0', '9', '6', '1', '4', '1', '0', '0', '0',
        '0', '0', '6', '2', '9', '8', '9', '1', '0', '0'];
    const reverseBarCodeArr2 = ['1', '3', '0', '5', '3', '9', '0', '8', '6', '0', '6', '0', '6', '1',
        '8', '4', '4', '1', '0', '4', '9', '0', '0', '5', '0', '0', '0', '1', '0', '0', '0', '0', '0',
        '0', '0', '7', '3', '7', '3', '9', '1', '0', '0'];
    const reverseBarCodeArr3 = ['7', '1', '1', '8', '5', '3', '3', '5', '3', '3', '0', '0', '3', '2',
        '9', '8', '6', '2', '3', '0', '0', '0', '0', '0', '0', '2', '2', '7', '1', '1', '0', '0', '0',
        '0', '0', '6', '3', '8', '8', '9', '1', '0', '0'];

    it('should return bar code validator digit from a reverse bar code array without validator digit', () => {
        expect(getMod11Validator(reverseBarCodeArr1)).toEqual('8');
        expect(getMod11Validator(reverseBarCodeArr2)).toEqual('3');
        expect(getMod11Validator(reverseBarCodeArr3)).toEqual('1');
    });
});

describe('getAmount', () => {
    const rawAmountSample1 = '000007990';
    const rawAmountSample2 = '000020001';
    const rawAmountSample3 = '003000122';

    it('should return the formatted amount from line code field', () => {
        expect(getAmount(rawAmountSample1)).toEqual('79.90');
        expect(getAmount(rawAmountSample2)).toEqual('200.01');
        expect(getAmount(rawAmountSample3)).toEqual('30001.22');
    });
});

describe('getExpirationDate', () => {
    const sampleExpirationFactor1 = '2005';
    const sampleExpirationFactor2 = '1000';
    const sampleExpirationFactor3 = '6857';

    it('should calculate and return expiration date from line code factor field', () => {
        expect(getExpirationDate(sampleExpirationFactor1)).toEqual('2003-04-04');
        expect(getExpirationDate(sampleExpirationFactor2)).toEqual('2000-07-03');
        expect(getExpirationDate(sampleExpirationFactor3)).toEqual('2016-07-16');
    });
});

describe('validateBlocks', () => {
    // title type
    const validLineCodeSample1 = '00190000090326892300436016465175889260000014169';
    const invalidLineCodeSample1 = '00190000080326892300436016465175889260000014169';
    const invalidLineCodeSample2 = '00190010090326892300436016465175889260000014169';
    // convenant type
    const validLineCodeSample2 = '836800000017984102222028201100000003000018319319';
    const invalidLineCodeSample3 = '836900000017984102222028201100000003000018319319';
    const invalidLineCodeSample4 = '836800000017984102222028201100000003000018319317';
    
    it('should calculate the validation digit for each line code block and\
    compare with the received ones, throwing an error if they are different', () => {
        expect(validateBlocks(validLineCodeSample1, 'title')).toBeUndefined();
        expect(() => { validateBlocks(invalidLineCodeSample1, 'title') }).toThrow(/invalid/i);
        expect(() => { validateBlocks(invalidLineCodeSample2, 'title') }).toThrow(/invalid/i);

        expect(validateBlocks(validLineCodeSample2, 'convenant')).toBeUndefined();
        expect(() => { validateBlocks(invalidLineCodeSample3, 'convenant') }).toThrow(/invalid/i);
        expect(() => { validateBlocks(invalidLineCodeSample4, 'convenant') }).toThrow(/invalid/i);
    });
});

describe('validateBarCode', () => {
    // title type
    const validBarCodeSample1 = '00198892600000141690000003268923003601646517';
    const invalidBarCodeSample1 = '00190892600000141690000003268923003601646517';
    const invalidBarCodeSample2 = '00198892600000141690000003268923003601646516';
    // convenant type
    const validBarCodeSample2 = '83680000001984102222022011000000000001831931';
    const invalidBarCodeSample3 = '83630000001984102222022011000000000001831931';
    const invalidBarCodeSample4 = '83684000001984102222022011000000000001831931';

    it('should calculate the validation digit and compare with the extracted one,\
    throwing an error if they are different', () => {
        expect(validateBarCode(validBarCodeSample1, 'title')).toBeUndefined();
        expect(() => { validateBarCode(invalidBarCodeSample1, 'title') }).toThrow(/invalid/i);
        expect(() => { validateBarCode(invalidBarCodeSample2, 'title') }).toThrow(/invalid/i);

        expect(validateBarCode(validBarCodeSample2, 'convenant')).toBeUndefined();
        expect(() => { validateBarCode(invalidBarCodeSample3, 'convenant') }).toThrow(/invalid/i);
        expect(() => { validateBarCode(invalidBarCodeSample4, 'convenant') }).toThrow(/invalid/i);
    });
});