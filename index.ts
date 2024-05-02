import express from 'express';
import { routerApi } from './routes/index';
import db from './db/db';

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
routerApi(app);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
