import request from 'supertest';
import { Ticket } from '@models/Ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '@models/Order';
import app from '../../app';
import NatsProvider from '../../providers/StreamingProvider/implementations/NatsProvider';

it('return an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

// it('return an error if the ticket is already reserved', async () => {
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 20,
//   });
//   await ticket.save();
//   const order = Order.build({
//     ticket,
//     userId: 'asdkjahsdkj',
//     status: OrderStatus.Created,
//     expiresAt: new Date(),
//   });
//   await order.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(400);
// });

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emails an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(NatsProvider.client.publish).toHaveBeenCalled();
});
