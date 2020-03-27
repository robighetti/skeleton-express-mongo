import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import AuthConfig from '../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, AuthConfig.secret);

    req.userId = decoded._id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token error' });
  }
};
