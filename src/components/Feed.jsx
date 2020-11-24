import { useOnGet } from 'onget';
import Post from './Post';

export default function Feed({ url }) {
  const feed = useOnGet(url);

  const user = useOnGet('localseal://user');

  console.log(feed, user);

  return (
    <main>
      {
        user && <Post />
      }
      &nbsp;
    </main>
  );
}
