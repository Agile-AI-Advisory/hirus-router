const Router = require('./dist');
const path = require('path');

const options = {
  port: 8080,
  onSetup: (app, express) => {
    app.use('/assets', express.static(path.join(__dirname, 'assets')));
  },
  onStart: () => {
    console.log('Server has started on port 8080');
  },
  onSuccess(res, response) {
    if (response.something !== undefined) {
      res.json({ error: false, data: response.something });
    }
  },
};

new Router([
  {
    path: '/',
    method: 'get',
    action: () => ('Standard success'),
  },
  {
    path: '/error',
    method: 'get',
    action: () => {
      throw new Error('Standard error');
    }
  },
  {
    path: '/promise',
    method: 'get',
    action: () => {
      return new Promise((resolve) => {
        resolve('Promise success');
      });
    }
  },
  {
    path: '/promise-error',
    method: 'get',
    action: () => {
      return new Promise((resolve, reject) => {
        reject({ message: 'Promise error' });
      });
    }
  },
  {
    path: '/promise-throw-error',
    method: 'get',
    action: () => {
      return new Promise(() => {
        throw new Error('Promise throw error');
      });
    }
  },
  {
    path: '/middleware',
    method: 'get',
    action: () => ('Middleware success'),
    middleware: [
      () => {
        return;
      }
    ],
  },
  {
    path: '/middleware-error',
    method: 'get',
    action: () => (false),
    middleware: [
      () => {
        throw new Error('Middleware error');
      }
    ],
  },
  {
    path: '/middleware-promise',
    method: 'get',
    action: () => ('Middleware promise success'),
    middleware: [
      () => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    ],
  },
  {
    path: '/middleware-promise-error',
    method: 'get',
    action: () => (false),
    middleware: [
      () => {
        return new Promise((resolve, reject) => {
          reject({ message: 'Middleware promise error' });
        });
      }
    ],
  },
  {
    path: '/middleware-promise-throw-error',
    method: 'get',
    action: () => (false),
    middleware: [
      () => {
        return new Promise((resolve, reject) => {
          throw new Error('Middleware promise error');
        });
      }
    ],
  },
  {
    path: '/override',
    method: 'get',
    action: (req, res) => {
      res.json({ 'text': 'Overridden response success' });
    },
  },
  {
    path: '/callback',
    method: 'get',
    action: (req, res) => {
      return { something: 'Callback success' };
    },
  },
], options);
