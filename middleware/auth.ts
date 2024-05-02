import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel'; // Asegúrate de tener la ruta correcta al modelo de usuario

// Declara la propiedad 'user' en la interfaz de solicitud de Express
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
//Middleware de autenticación
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const data = jwt.verify(token, process.env.JWT_KEY || '') as { _id: string };
        const user = await User.findOne({ _id: data._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};

export default auth;
