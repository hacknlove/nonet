import { switchMethod } from 'server/app';
import { encrypt, decrypt } from 'kissmycipher';
import kissmyhash from 'kissmyhash';

export default switchMethod({
  POST: [
    {
      verbose: false,
      schema: {
        type: 'object',
        required: ['body'],
        properties: {
          body: {
            type: 'object',
            required: ['password'],
            properties: {
              password: { type: 'string' },
            },
          },
        },
      },
    },
    getUser,
    createUserIfNotExists,
    checkPassword,
    insertSession,
  ],
});

async function getUser({ mongo, set, control: { go } }) {
  set.user = await mongo.users.findOne();

  if (set.user) {
    go(checkPassword);
  }
}

async function createUserIfNotExists({ mongo, set }) {
  const plainPassword = process.env.PASSWORD || 'password';

  const clientPassword = kissmyhash((plainPassword) + process.env.NEXT_PUBLIC_SECRET, { length: process.env.NEXT_PUBLIC_PASSWORD_HASH_LENGTH });

  const serverPassword = kissmyhash((clientPassword) + process.env.SECRET, { length: process.env.PASSWORD_HASH_LENGTH });

  const expires = Date.now();

  const password = encrypt(process.env.SECRET, {
    serverPassword,
    expires,
  });

  set.user = {
    password,
    expires,
  };

  await mongo.users.insertOne(set.user);
}

function checkPassword({ get: { user: { password } }, control: { done } }, { body: { password: clientPassword } }) {
  const sealedPassword = decrypt(process.env.SECRET, password);

  const serverPassword = kissmyhash((clientPassword) + process.env.SECRET, { length: process.env.PASSWORD_HASH_LENGTH });

  if (sealedPassword.serverPassword !== serverPassword) {
    return done({
      error: 'Contraseña erronea',
    });
  }
}

async function insertSession({ mongo }, { headers: { 'x-forwarded-for': ip } }) {
  const session = await mongo.sessions.insertOne({
    exp: new Date(Date.now() + Number(process.env.SESSION_EXPIRATION)),
    access: [
      {
        date: new Date(),
        ip,
      },
    ],
  });

  return {
    local: 1,
    site: process.env.NEXT_PUBLIC_SITE,
    token: encrypt(process.env.SECRET, {
      sid: String(session.insertedId),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    }),
  };
}
