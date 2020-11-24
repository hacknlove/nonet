/* eslint-disable jsx-a11y/no-static-element-interactions */
import Head from 'next/head';
import { useEffect } from 'react';
import clsx from 'clsx';
import CurrentUser from 'components/CurrentUser';
import { useOnGet, set } from 'onget';
import Icon from '../icons/wsw.svg';
import Dots from '../icons/dots.svg';

function sethshowed(value) {
  set('fast://hshowed', value);
}
function setvshowed(value) {
  set('fast://vshowed', value);
}

set('fast://vshowed', true);

export default function Header({
  title, header, footer, menu,
}) {
  const hshowed = useOnGet('fast://hshowed');
  const vshowed = useOnGet('fast://vshowed');

  useEffect(() => {
    let y = 0;
    function handler() {
      const oldY = y;
      y = window.scrollY;
      if (y < 100) {
        setvshowed(true);
        return;
      }
      if (y < oldY) {
        setvshowed(true);
        return;
      }
      setvshowed(false);
    }
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <Head>
        <title>{ title }</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        header && (
          <div id="Header" className={clsx({ 'is-showed': vshowed, hasRightMenu: menu })}>
            <Icon id="Icon" />
            {header}
            { menu && (
              <button type="button" className="icon toggleMenu" onClick={() => sethshowed(true)}>
                <Dots />
              </button>
            )}
          </div>
        )
      }
      {
        footer && (
          <div id="Footer" className={clsx({ 'is-showed': vshowed, hasRightMenu: menu })}>
            {footer}
            { menu && (
              <button type="button" className="icon toggleMenu" onClick={() => sethshowed(true)}>
                <Dots />
              </button>
            )}
          </div>
        )
      }
      {
        menu && (
          <>
            <div id="Menu" className={clsx({ 'is-showed': hshowed })}>
              <CurrentUser />
              {menu}
            </div>
            <div
              id="hideMenu"
              className={clsx({ 'is-showed': hshowed })}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  sethshowed(false);
                }
              }}
              onClick={() => sethshowed(false)}
            />
          </>
        )
      }
    </>
  );
}
