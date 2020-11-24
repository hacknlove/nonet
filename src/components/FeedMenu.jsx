import { useOnGet } from 'onget';

export default function Feed({ url }) {
  const feed = useOnGet(url);

  const user = useOnGet('localseal://user');

  console.log(feed, user);

  return (
    <main>
      &nbsp;
    </main>
  );
}
