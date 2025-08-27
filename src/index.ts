declare var module: any;

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as merge from 'lodash.merge';

interface Route {
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'all',
  action: Function,
  middleware?: Array<Function>,
};

interface Options {
  port?: number,
  limit?: string,
  onSetup?: Function,
  onStart?: Function,
  onSuccess?: Function,
  onError?: Function,
};

class Router
{
  app: express.Express;

  constructor(routes: Route[], options: Options = {})
  {
    const defaultProps: Options = {
      port: 3000,
      limit: '5mb',
      onSetup: () => {},
      onStart: () => {},
      onSuccess: () => {},
      onError: () => {},
    };

    const props = merge(defaultProps, options);

    // Register Express application
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false, limit: props.limit }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    props.onSetup(this.app, express);

    // Register routes
    routes.forEach((route) => {
      let middleware: Array<express.RequestHandler> = [];
      if (route.middleware !== undefined) {
        route.middleware.forEach((method) => {
          middleware.push(async (req, res, next) => {
            try {
              await method(req, res);
              next();
            } catch (err) {
              res.json({ error: err.message });
            }
          })
        });
      }

      this.app[route.method](route.path, middleware, async (req, res) => {
        try {
          let response = await route.action(req, res);
          if (!res.headersSent) {
            await props.onSuccess(res, response);
            if (!res.headersSent) {
              res.json({ error: false, data: response });
            }
          }
        } catch (err) {
          await props.onError(res, err);
          if (!res.headersSent) {
            res.json({ error: err.message });
          }
        }
      });
    });

    // Run application
    this.app.listen(props.port, props.onStart);
  }
};

module.exports = Router;
