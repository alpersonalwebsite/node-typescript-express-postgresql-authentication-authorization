import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../middlewares/verifyAuthToken';
import { Product, ProductStore } from '../models/product';
import { HandlerError } from './helpers/handleError';

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  const product = await store.show(req.params.id);
  try {
    if (!product) {
      throw new HandlerError(404, `We don't have that product`);
    }
    res.json(product);
  } catch (err) {
    if (err instanceof HandlerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  };
  try {
    if (!product.name) {
      throw new HandlerError(400, `name is required`);
    }
    if (!product.price) {
      throw new HandlerError(400, `price is required`);
    }
    const createdProduct = await store.create(product);
    res.json(createdProduct);
  } catch (err) {
    if (err instanceof HandlerError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

const productRoutes = (app: express.Application): void => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default productRoutes;
