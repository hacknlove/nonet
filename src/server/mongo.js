import { MongoClient } from 'mongodb';

let mongo;

async function mongoConnect() {
  if (mongo) {
    return;
  }
  const client = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongo = client.db();

  mongo.on('close', () => {
    mongo = false;
  });

  mongo.on('ontimeout', () => {
    mongo = false;
  });
}

export default async function mongoToContext(state) {
  if (!mongo) {
    await mongoConnect();
  }
  state.mongo = new Proxy({},
    {
      get(target, name) {
        return mongo.collection(name);
      },
    });
}

export async function getMongo() {
  const s = {};

  await mongoToContext(s);

  return s.mongo;
}
