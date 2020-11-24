import Ajv from 'ajv';

const ajv = new Ajv({ coerceTypes: true });

export default function validate({
  schema, control: { done },
}, { body, query }) {
  const valid = ajv.validate(schema, { query, body });

  if (valid) {
    return;
  }

  return done({
    error: ajv.errors,
  }, 400);
}
