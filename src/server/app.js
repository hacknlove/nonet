import steprunner from 'server/steprunner';
import validate from 'server/validate';
import errorHandling from 'server/errorHandling';

let mongo;
if (process.env.MONGO_URL) {
  mongo = require('server/mongo').default;
}

export default function app(...array) {
  let options;

  if (typeof array[0] === 'function') {
    options = {};
  } else {
    options = array.shift();
  }

  if (options.schema) {
    array.unshift(validate);
  }

  if (mongo && !options.noMongo) {
    array.unshift(mongo);
  }

  return steprunner([
    ...array,
  ], {
    response: {
      status: 500,
      data: {
        ok: false,
      },
      errors: ['Error desconocido'],
    },
    after({ control: { response, status, headers } }, req, res) {
      if (status) {
        res.statusCode = status;
      }
      if (headers) {
        Object.entries(headers).forEach((entry) => res.setHeader(...entry));
      }
      res.json(response);
    },
    errorHandling,
    ...options,
  });
}

export function switchMethod(dict) {
  return function sw(req, res) {
    switch (typeof dict[req.method]) {
      case 'undefined':
        return res.status(404).json({ status: 404, error: 'not found' });
      case 'function':
        return dict[req.method](req, res);
      default:
        dict[req.method] = app(...dict[req.method]);
        return dict[req.method](req, res);
    }
  };
}
