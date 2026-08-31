import { Router } from 'express';

const testRoute = Router();

testRoute.get('/', (req, res) => {
    res.send('Test route is working!');
});

export default testRoute;