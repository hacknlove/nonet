import { getMongo } from 'server/mongo';
import { EJSON } from 'bson';
import defaultSite from 'lib/defaultSite';

export default async function getSite() {
  const mongo = await getMongo();

  const site = mongo.site.findOne({}, { projection: { _id: 0 } }) || {};

  return EJSON.serialize({
    ...defaultSite,
    ...await site || {},
  });
}
