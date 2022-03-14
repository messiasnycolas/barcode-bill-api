import supertest from 'supertest';
import { app } from '../../src/server'

const request = supertest(app);

describe('Endpoint /boleto tests', () => {
    const validLineCodeSample1 = '846700000017049902962023203154740005002433499304';
    const invalidLineCodeSample2 = '84A700000017049902962023203154740005002433499304';
    const invalidLineCodeSample3 = '846700100017049902962023203154740005002433499304';
    const validLineCodeSample4 = '00190000090326892300436016465175889260000014169';
    const invalidLineCodeSample5 = '00198892600$00141690000003268923003601646517';

    it('should return JSON data when called GET with a valid line code\
    and return an error when called GET with a invalid line code.', async (done = (): void => {}) => {

        const res1 = await request.get(`/boleto/${validLineCodeSample1}`);
        expect(res1.status).toBe(200);
        expect(res1.body).toEqual(
            {
                amount: '104.99',
                expirationDate: '',
                barCode: '84670000001049902962022031547400000243349930'
            }
        );

        const res2 = await request.get(`/boleto/${invalidLineCodeSample2}`);
        expect(res2.status).toBe(400);

        const res3 = await request.get(`/boleto/${invalidLineCodeSample3}`);
        expect(res3.status).toBe(400);

        const res4 = await request.get(`/boleto/${validLineCodeSample4}`);
        expect(res4.status).toBe(200);
        expect(res4.body).toEqual(
            {
                amount: '141.69',
                expirationDate: '2022-03-16',
                barCode: '00198892600000141690000003268923003601646517'
            }
        );

        const res5 = await request.get(`/boleto/${invalidLineCodeSample5}`);
        expect(res5.status).toBe(400);

        done();
    });
});

