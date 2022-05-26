import express, { Request, Response } from 'express';
import { Ticket } from '@models/Ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const ticket = await Ticket.find({
    orderId: undefined,
  });

  res.send(ticket);
});

export { router as indexTicketRouter };
