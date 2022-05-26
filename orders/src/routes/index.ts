import { Router } from 'express';
import { showOrderRouter } from './show';
import { createOrderRouter } from './new';
import { listOrderRouter } from './list';
import { deleteOrderRouter } from './delete';

const routes = Router();

routes.use('/api/orders', showOrderRouter);
routes.use('/api/orders', createOrderRouter);
routes.use('/api/orders', listOrderRouter);
routes.use('/api/orders', deleteOrderRouter);

export default routes;
