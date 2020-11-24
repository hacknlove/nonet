import { getMongo } from 'server/mongo';
import { EJSON } from 'bson';

export default async function getFeed(url, ejson) {
  const mongo = await getMongo();

  const posts = mongo.posts.find({
    feed: url,
  }).sort({ _id: -1 }).limit(20).toArray();

  if (ejson) {
    return EJSON.serialize(posts);
  }
  return posts;
}
