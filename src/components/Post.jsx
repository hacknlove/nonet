import useKMF from 'kissmyform';
import Router from 'next/router';
import { set, get } from 'onget';
import authFetch from 'lib/authFetch';
import autosize from 'autosize';
import { useEffect, useRef } from 'react';

const tagsRegexp = /(^|\s)[#@][a-z0-9_.-]+/gi;
const mentionsRegexp = /(^|\s)[#@][a-z0-9_.-]+/gi;
const linksRegexp = /(^|\s)(http(s?):\/\/)?[0-9a-z-]+\.([0-9a-z-]+\.?)+(\/[^ ]*)?/gi;

function findWhatWhere(what, where) {
  return (where.match(what) || []).map((s) => s.trim());
}

async function onSubmit({ micropost }) {
  const response = await authFetch({
    method: 'POST',
    url: '/api/newPost',
    body: {
      feed: get('fast://feed'),
      micropost,
      tags: findWhatWhere(tagsRegexp, micropost),
      mentions: findWhatWhere(mentionsRegexp, micropost),
      links: findWhatWhere(linksRegexp, micropost),
    },
  });

  console.log(response);
}

function moreOptions(micropost) {
  set('fast://micropost', micropost);
  Router.push('/-/more-options');
}

export default function NewPost() {
  const {
    handleSubmit, inputControl, state: { values: { micropost = '' } },
  } = useKMF();
  const textarea = useRef(null);

  useEffect(() => {
    autosize(textarea.current);
    return () => {
      autosize.destroy(textarea.current);
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="NewPost">
      <textarea {...inputControl('micropost')} ref={textarea} />
      <button type="submit" disabled={!micropost.length}>Publicar</button>
    </form>
  );
}
