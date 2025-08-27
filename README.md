# Router

Generic routing microservice for JSON APIs.

## Usage

Add the package to your project via yarn or NPM. Be sure to add an appropriate version to the end.

```sh
yarn add https://git@git.digital-results.com/resources/router.git#1.0.2
```

Import the `Router` class into your project for use.

```js
import Router from 'router';
```

## Reference

### Route Parameters

- `path` - The request URL path
- `method` - The request method. Can be one of the following
    - `get`
    - `post`
    - `put`
    - `delete`
    - `all` (Accepts any request)
- `action` - The controller method. Return data for a successful response, or throw an error if something is wrong. This can also handle Promises.
- `middleware` (optional) - An array of middleware functions. Acts in the same way as an`action`, but returning data will cause the middleware to proceed to the next middleware or controller method.

### Router Options

- `port` (optional) - Port the server runs on. Defaults to `3000`.
- `limit` (optional) - Maximum request size. Defaults to `5mb`.
- `onSetup(app, express)` (optional) - Function to call to modify the ExpressJS application.
- `onStart` (optional) - Function to call when the server has successfully started.
- `onSuccess(res, response)` (optional) - Function to call when a response is returned.
- `onError(res, error)` (optional) - Function to call when an error is caught.

### Response Format

- `error` - Whether or not an error occurred. Contains the error message if something went wrong or is just the value of `false`.
- `data` (optional) - The payload response, if any.

## Example

```js
new Router([
  {
    path: '/',
    method: 'get',
    action: () => ('Hello World!'),
  },
  {
    path: '/',
    method: 'post',
    action: (req) => ({ name: req.body.name }),
    middleware: [
      (req) => {
        if (Math.random() > 0.9) {
          throw new Error('Stop right there, criminal scum!');
        }
        return;
      }
    ],
  },
]);
```
