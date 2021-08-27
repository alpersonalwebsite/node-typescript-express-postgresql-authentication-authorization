import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

interface UserToken extends jwt.JwtPayload {
  user: User;
}

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const decodedToken: UserToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ''
    ) as UserToken;
    const { id } = decodedToken.user;
    res.locals.token = {
      id
    };

    next();
  } catch (err) {
    res.status(401).json({ message: `Invalid token!` });
  }
};
