import Head from 'next/head';
import 'lib/localseal';

import 'normalize.css/normalize.css';
import 'styles/style.scss';

import Login from 'components/Login';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Maven+Pro&family=Playfair+Display&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <Login />
    </>
  );
}

export default MyApp;
