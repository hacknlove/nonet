import { useOnGet } from 'onget';
import Link from 'next/link';

export default function Feed({ url }) {
  const feed = useOnGet(url);

  const user = useOnGet('localseal://user') || {};

  console.log(feed, user);

  return (
    <main className="verticalMenu">
      {
        user.local && (
          <Link href="/-/new-feed">
            <button type="button">Nuevo feed</button>
          </Link>
        )
      }
      <Link href="/">
        <button type="button">Principal</button>
      </Link>
      &nbsp;
    </main>
  );
}
