import { getBillType, hasNonNumberCharacters } from '../src/services/bill.service';


describe('hasNonNumberCharacters', () => {
    it('should return true when there are non number characters in line code', () => {
        const letters = 'abcdefghijklmnop';
        expect(hasNonNumberCharacters(letters)).toBeTruthy();
        
        const mixed = 'a1b2c3d4e5f6g7h8i9j10';
        expect(hasNonNumberCharacters(mixed)).toBeTruthy();
        
        const specialMixed = '23131#41231*';
        expect(hasNonNumberCharacters(specialMixed)).toBeTruthy();

        const spaceMixed = '1231224 3123123';
        expect(hasNonNumberCharacters(spaceMixed)).toBeTruthy();

        const numbers = '1234567890102301';
        expect(hasNonNumberCharacters(numbers)).toBeFalsy();
    });
});

describe('getBillType', () => {
    it('should detect and return bills type', () => {
        const convenantExample = '836900000016294502222028202100000001000019041961';
        expect(getBillType(convenantExample)).toEqual('convenant');

        const titleExample = '00190000090326892300436016465175889260000014169';
        expect(getBillType(titleExample)).toEqual('title');
    });
});
