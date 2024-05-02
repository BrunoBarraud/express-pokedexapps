import express, { Request, Response } from 'express';
import { CategoriesService } from '../services/categories.service';
const router = express.Router();
const categoriesService = CategoriesService.getInstance();

interface Category {
  id: number;
  name: string;
  image: string;
}

router.get('/', async (req: Request, res: Response) => {
  //Simulate a timeout with promises
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 5000); //Timeout after 5 seconds
  });
  const categoriesPromise = categoriesService.getCategories();

  try {
    //Wait for either the categories to be fetched or the timeout to occur
    const categories = await Promise.race([categoriesPromise, timeoutPromise]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/filter', async (req: Request, res: Response) => {
  res.json({ message: 'Filter categories' });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'Invalid id' });
  }
  const category = await categoriesService.findCategory(Number(id));
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

router.post('/addCategory', async (req: Request, res: Response) => {
  const { id, name, image } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const newCategory: Category = {
    id: Number(id),
    name: String(name),
    image: String(image),
  };

  await categoriesService.addCategory(newCategory);
  res.json(newCategory);
});

router.patch('updateCategory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image } = req.body;

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const category = await categoriesService.findCategory(Number(id));
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  category.name = name;
  category.image = image;

  await categoriesService.updateCategory(Number(id), category);
  res.json(category);
});

export default router;
