import { useOnGet, set } from 'onget';
import Link from 'next/link';
import defaultSite from 'lib/defaultSite';

import User from '../icons/User.svg';

function LoginButton() {
  return (
    <div id="CurrentUser">
      <button
        type="button"
        aria-label="avatar"
        className="icon"
        onClick={() => {
          set('fast://login', true);
          set('fast://hshowed', false);
          set('fast://vshowed', false);
        }}
      >
        <User />
        <label>
          Entrar
        </label>
      </button>
    </div>
  );
}

function Local() {
  const site = useOnGet('/miniature.json', { first: defaultSite });
  return (
    <div id="CurrentUser">
      <Link href="/-/config">
        <button
          type="button"
          aria-label="avatar"
          className="icon"
          onClick={() => {
            set('fast://hshowed', false);
            set('fast://vshowed', false);
          }}
        >
          <img src={site.image} />
          <label>
            {site.site}
          </label>
        </button>
      </Link>
    </div>
  );
}

function Remote() {
  return <p>Hola</p>;
}

export default function CurrentUser() {
  const user = useOnGet('localseal://user');

  if (!user) {
    return <LoginButton />;
  }

  if (user.local) {
    return <Local />;
  }

  return <Remote />;
}
