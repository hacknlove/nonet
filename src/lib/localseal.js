import { registerPlugin } from 'onget';
import { encrypt, decrypt } from 'kissmycipher';
import equal from 'fast-deep-equal';

const PROTOCOLCUT = 'localseal://'.length;

if (!process.browser) {
  global.localStorage = {};
}

function parseIfPossible(value) {
  try {
    return decrypt(process.env.NEXT_PUBLIC_SECRET, value);
  } catch (e) {
    return null;
  }
}

export function onChange(resource) {
  if (!global.addEventListener || !global.removeEventListener) {
    return;
  }
  function listener() {
    const unsealed = equal(parseIfPossible(localStorage[resource.key]));
    if (equal(unsealed, resource.value)) {
      return;
    }
    resource.value = unsealed;
    Object.values(resource.callbacks).forEach((cb) => cb(resource.value));
  }
  global.addEventListener('storage', listener);
  return () => {
    global.removeEventListener(listener);
  };
}

const plugin = {
  name: 'localseal',
  regex: /^localseal:\/\/./i,
  refresh(resource) {
    return parseIfPossible(localStorage[resource.key]);
  },
  getResource(resource) {
    resource.unsubscribeStorage = onChange(resource);
    resource.key = `%%${resource.url.substr(PROTOCOLCUT)}`;

    if (localStorage[resource.key] !== undefined) {
      resource.value = parseIfPossible(localStorage[resource.key]);
      return;
    }

    if (resource.value === undefined) {
      return;
    }
    localStorage[resource.key] = encrypt(process.env.NEXT_PUBLIC_SECRET, resource.value);
  },
  get(url) {
    return parseIfPossible(localStorage[url.substr(PROTOCOLCUT)]);
  },
  set(resource) {
    if (resource === undefined) {
      return delete localStorage[resource.key];
    }
    localStorage[resource.key] = encrypt(process.env.NEXT_PUBLIC_SECRET, resource.value);
  },
  clean(resource) {
    if (resource.unsubscribeStorage) {
      resource.unsubscribeStorage();
    }
  },
  start() {
    global.localStorage = {};
  },
};

registerPlugin(plugin);
