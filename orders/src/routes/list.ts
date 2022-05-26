import express, { Request, Response } from 'express';
import { requireAuth } from '@ictickets/common';
import { Order } from '@models/Order';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(order);
});

export { router as listOrderRouter };
