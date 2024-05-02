import express, { Request, Response } from 'express';
import { ProductsService } from '../services/products.service';

const router = express.Router();
const productsService = new ProductsService();

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

router.get('/', async (req: Request, res: Response) => {
  // Simulate a timeout with promises
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 5000); // Timeout after 5 seconds
  });

  const productsPromise = productsService.getProducts();

  try {
    // Wait for either the products to be fetched or the timeout to occur
    const products = await Promise.race([productsPromise, timeoutPromise]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error.message"});
  }
});

router.get('/filter', async (req: Request, res: Response) => {
  res.json({ message: 'Filter products' });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'Invalid id' });
  }
  const product = await productsService.findProduct(Number(id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

router.post('/addProduct', async (req: Request, res: Response) => {
  const { id, name, price, image } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const newProduct: Product = {
    id: Number(id),
    name: String(name),
    price: Number(price),
    image: String(image),
  };

  if (
    !newProduct.id ||
    !newProduct.name ||
    !newProduct.price ||
    !newProduct.image
  ) {
    return res.status(400).json({ message: 'Invalid product' });
  }

  const productExists = await productsService.findProduct(newProduct.id);
  if (productExists) {
    return res.status(400).json({ message: 'Product already exists' });
  }

  await productsService.addProduct(newProduct);
  return res
    .status(201)
    .json({ message: 'Product added successfully', product: newProduct });
});

// Add logic to save the new product to the database or perform any other necessary operations

router.patch('/updateProduct/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  const updatedProduct: Product = {
    id: Number(id),
    name: String(name),
    price: Number(price),
    image: String(image),
  };

  if ((await productsService.findProduct(updatedProduct.id)) === undefined) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await productsService.updateProduct(updatedProduct.id, updatedProduct);

  // Add logic to update the product in the database or perform any other necessary operations
  res.json({
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

router.delete('/deleteProduct/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if ((await productsService.findProduct(Number(id))) === undefined) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await productsService.deleteProduct(Number(id));

  res.json({ message: `Product ${id} deleted successfully` });
});

export default router;
