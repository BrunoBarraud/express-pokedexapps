import express, { Request, Response, } from 'express';
const User = require('../models/userModel');
const auth = require('../middleware/auth');
import { ParamsDictionary } from 'express-serve-static-core';
const router = express.Router();



router.post('/users', async (req: Request, res: Response) => {
  // Crear un nuevo usuario
  try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
  } catch (error) {
      res.status(400).send(error);
  }
});

router.post('/users/login', async (req: Request, res: Response) => {
  // Login de usuario
  try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
          return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
  } catch (error) {
      res.status(400).send(error);
  }
});

router.get('/profile', auth, async (req: Request, res: Response) => {
  // Ver perfil del usuario
  res.send(req.user);
});

export default router;

