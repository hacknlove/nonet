import { switchMethod } from 'server/app';
import defaultSite from 'lib/defaultSite';

export default switchMethod({
  GET: [
    getMiniature,
  ],
});

async function getMiniature({ mongo }) {
  const site = await mongo.site.findOne({}, { projection: { _id: 0 } }) || {};

  return {
    ...defaultSite,
    ...site,
  };
}
