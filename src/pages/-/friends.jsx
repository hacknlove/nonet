import Nav from 'components/Nav';
import getSite from 'server/getSite';

import MainFooter from 'components/MainFooter';

export default function Home({ parameters }) {
  global.parameters = parameters;

  return (
    <>
      <Nav
        title={parameters.title}
        header={<div>{parameters.title}</div>}
        footer={<MainFooter />}
        menu={(
          <div>
            {parameters.title}
          </div>
        )}
      />

      <main>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>
        <h1>
          Friends
        </h1>

      </main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      parameters: await getSite(),
    },
  };
}
