import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@ictickets/common';
import { Order, OrderStatus } from '@models/Order';
import { OrderCancelledPublisher } from '@providers/StreamingProvider/implementations/publishers/OrderCancelledPublisher';
import NatsProvider from '@providers/StreamingProvider/implementations/NatsProvider';

const router = express.Router();

router.delete('/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an event saying this was cancelled!
  await new OrderCancelledPublisher(NatsProvider.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
