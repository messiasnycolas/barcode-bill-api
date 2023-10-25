import 'dotenv/config';
import express from 'express';
import { billRouter } from './routes/bill.routes';
import swaggerUi from 'swagger-ui-express';
import { doc } from './doc';

const app = express();
app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(doc))
app.use('/billet', billRouter);

export { app };