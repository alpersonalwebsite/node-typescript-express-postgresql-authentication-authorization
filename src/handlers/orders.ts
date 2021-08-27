import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../middlewares/verifyAuthToken';
import { Order, OrderStore } from '../models/order';
import { HandlerError } from './helpers/handleError';
import { isTheUser } from '../utils/user';

const store = new OrderStore();

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(req.params.id);
    if (!order) {
      throw new HandlerError(404, `We don't have that order`);
    }
    const isTheOwnUser = isTheUser(
      parseInt(res.locals.token.id),
      order.user_id
    );
    // We don't want people checking others orders
    if (!isTheOwnUser) {
      throw new HandlerError(401, `You don't have access`);
    }
    res.json(order);
  } catch (err) {
    if (err instanceof HandlerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const order: Order = {
    status: req.body.status,
    user_id: res.locals.token.id
  };
  try {
    if (!order.status) {
      throw new HandlerError(400, `status is required`);
    }
    const createOrder = await store.create(order);
    res.json(createOrder);
  } catch (err) {
    if (err instanceof HandlerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const order_id = parseInt(req.params.id);
  const product_id = parseInt(req.body.product_id);
  const quantity = parseInt(req.body.quantity);
  const user_id = parseInt(res.locals.token.id);

  try {
    const addedProduct = await store.addProduct({
      quantity,
      order_id,
      product_id,
      user_id
    });
    res.json(addedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
