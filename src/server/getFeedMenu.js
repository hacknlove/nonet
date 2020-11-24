import { getMongo } from 'server/mongo';

export default async function getFeed() {
  const mongo = await getMongo();

  const feeds = await mongo.feeds.find().toArray();

  return feeds;
}
