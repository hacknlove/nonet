import { get, set } from 'onget';

export default async function authFetch(options) {
  const user = get('localseal://user');
  if (!user || !user.token) {
    return { error: 'Not allowed' };
  }

  const response = await fetch(options.url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body),
  }).catch((error) => ({ json() { return error; } }));

  if (response.status === 401) {
    set('localseal://user');
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    json: await response.json().catch(() => ({})),
  };
}
