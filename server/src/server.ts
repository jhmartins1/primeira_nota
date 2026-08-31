import express from 'express';
import testRoute from './utils/test.routes';

const app = express();

app.use('/test', testRoute);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT} 🚀`);
});