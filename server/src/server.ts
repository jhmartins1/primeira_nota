import express from 'express';
import testRoute from './utils/test.routes';
import { instrumentRoutes } from './routes/instrument.routes';

const app = express();

app.use(express.json());
app.use('/test', testRoute);
app.use('/instrument', instrumentRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT} 🚀`);
});