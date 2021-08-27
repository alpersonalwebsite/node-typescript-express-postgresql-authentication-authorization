import express from 'express';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';

const app: express.Application = express();
const PORT = process.env.PORT || 3000;
export const address = `0.0.0.0:${PORT}`;

app.use(express.json());

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(PORT, (): void => {
  console.log(`REST API on ${address}`);
});

export default app;
