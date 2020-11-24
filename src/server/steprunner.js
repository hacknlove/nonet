function noop() {}

module.exports = function stepping(
  steps,
  {
    after,
    afterEach,
    before,
    beforeEach,
    errorHandling,
    logger,
    newSet = () => ({}),
    verbose,
    ...other
  },
) {
  for (const step of steps) {
    if (typeof step !== 'function') {
      throw new Error(`${step} is not a function`);
    }
  }

  return async function runner(...params) {
    let waitRes = noop;
    let waitRej = noop;
    let waitProm = Promise.resolve();
    const set = newSet(...params);
    const state = {
      ...other,
      set,
      get: set,
      control: {
        done(response, status, headers) {
          if (status) {
            state.control.status = status;
          }
          if (headers) {
            state.control.headers = headers;
          }
          state.control.isDone = true;
          return response;
        },
        go(to) {
          switch (typeof to) {
            case 'number':
              state.control.nextI = to;
              return;
            case 'string':
              state.control.nextI = steps.findIndex((step) => step.name === to);
              if (state.control.nextI === -1) {
                errorHandling(
                  steps[state.i].name,
                  { type: 'internal', message: `Step ${to} not found` },
                  state,
                );
              }
              return;
            case 'function':
              state.control.nextI = steps.findIndex((step) => step === to);
              if (state.control.nextI === -1) {
                errorHandling(
                  steps[state.i].name,
                  { type: 'internal', message: `Step ${to.name} not found` },
                  state,
                );
              }
              return;
            default:
              errorHandling(
                steps[state.i].name,
                {
                  type: 'internal',
                  message: `go requires number, string or function. Not ${typeof to}`,
                },
                state,
              );
          }
        },
        wait() {
          waitProm = new Promise((resolve, reject) => {
            waitRes = resolve;
            waitRej = reject;
          });
        },
        next(err, res) {
          if (err) {
            waitRej(err);
          } else {
            waitRes(res);
          }
          waitProm = Promise.resolve();
        },
        autoLoggin: Boolean(logger),
        logger: logger === true ? console.log : logger,
        isDone: false,
        i: 0,
        nextI: false,
      },
    };

    if (typeof before === 'function') {
      await before(state, ...params);
    }

    while (true) {
      if (state.control.nextI !== false) {
        state.control.i = state.control.nextI;
        state.control.nextI = false;
      }
      const step = steps[state.control.i++];
      if (!step) {
        break;
      }

      if (state.control.isDone) {
        break;
      }

      if (verbose) {
        console.log({
          i: state.control.i,
          step: step.name,
          data: state.data,
        });
      }

      try {
        if (typeof beforeEach === 'function') {
          await beforeEach(state, ...params);
        }
        state.control.response = (await step(state, ...params)) || state.control.response;
        state.control.response = (await waitProm) || state.control.response;

        if (typeof afterEach === 'function') {
          await afterEach(state, ...params);
        }
      } catch (_error) {
        state.control.response = {
          ...state.control.response,
          _error,
        };
      }

      if (state.control.response && state.control.response._error && errorHandling) {
        state.control.response = (await errorHandling(step.name, state.control.response._error, state, ...params))
          || state.control.response;
      }

      if (state.control.response === state.control.wait) {
        state.control.response = await waitProm;
      }

      if (state.control.autoLoggin && state.control.logger) {
        state.control.logger({
          i: state.i,
          step: step.name,
          ts: Date.now(),
          get: state.get,
          response: state.control.response,
        });
      }

      if (state.control.response && state.control.response._error) {
        break;
      }
    }

    if (typeof after === 'function') {
      await after(state, ...params);
    }

    return state.control.response;
  };
};
