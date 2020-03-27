import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './controllers/user.controller';
import SessionController from './controllers/session.controller';

import authMiddleware from './middlewares/auth';

import FileController from './controllers/file.controller';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
