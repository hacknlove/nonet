import Nav from 'components/Nav';
import getSite from 'server/getSite';
import getFeed from 'server/getFeed';
import getFeedMenu from 'server/getFeedMenu';
import { EJSON } from 'bson';

import MainFooter from 'components/MainFooter';
import { set } from 'onget';

import Feed from 'components/Feed';
import FeedMenu from 'components/FeedMenu';

export default function Home({ site, feed, feedMenu }) {
  set('/miniature.json', site);
  set('/api/feed?url=/', feed);
  set('/api/feedMenu?url=/', feedMenu);
  set('fast://feed', '/');

  return (
    <>
      <Nav
        title={site.title}
        header={<div>{site.title}</div>}
        footer={<MainFooter />}
        menu={<FeedMenu url="/api/feedMenu?url=/" />}
      />

      <Feed url="/api/feed?url=/" />
    </>
  );
}

export async function getStaticProps() {
  const site = getSite();
  const feed = getFeed('/');
  const feedMenu = getFeedMenu('/');

  return {
    props: {
      site: EJSON.serialize(await site),
      feed: EJSON.serialize(await feed),
      feedMenu: EJSON.serialize(await feedMenu),
    },
  };
}
