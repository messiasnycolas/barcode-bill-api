import express from 'express';
import { billRouter } from './routes/bill.routes';
import swaggerUi from 'swagger-ui-express';
import { doc } from './doc';

const app = express();
app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(doc))
app.use('/boleto', billRouter);

app.listen(3000, () => console.log('Server is listening on port 3000'));