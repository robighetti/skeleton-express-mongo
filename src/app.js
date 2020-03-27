import 'dotenv/config';

import express from 'express';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import { resolve } from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './config/database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.server.use(cors());

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan('dev'));
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'dev') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
