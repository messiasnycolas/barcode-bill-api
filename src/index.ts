import express from 'express';
import { billRouter } from './routes/bill.routes';

const app = express();
app.use(express.json());

app.use('/boleto', billRouter);

app.listen(3000, () => console.log('Server is listening on port 3000'));