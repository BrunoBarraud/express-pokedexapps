import express from 'express';
import productsRoutes from './products';
import userRoutes from './users';
import categoryRoutes from './categories';

export function routerApi(app: express.Application) {
  app.use('/products', productsRoutes);
  app.use('/users', userRoutes);
  app.use('/categories', categoryRoutes);
}
