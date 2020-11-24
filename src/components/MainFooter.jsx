import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import Home from '../icons/Home.svg';
import Chat from '../icons/Chat.svg';
import Friends from '../icons/Friends.svg';
import Search from '../icons/Search.svg';

function FooterButton({
  href, Icon, label,
}) {
  const router = useRouter();
  return (
    <Link href={href}>
      <button aria-label={label} type="button" className={clsx('icon', { isActive: href === router.route })}><Icon /></button>
    </Link>
  );
}

export default function MainFooter() {
  return (
    <>
      <FooterButton href="/" label="home" Icon={Home} />
      <FooterButton href="/-/chat" label="home" Icon={Chat} />
      <FooterButton href="/-/friends" label="home" Icon={Friends} />
      <FooterButton href="/-/search" label="home" Icon={Search} />
    </>
  );
}
