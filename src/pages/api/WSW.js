import { switchMethod } from 'server/app';

export default switchMethod({
  GET: [
    {
      response: {
        ok: true,
      },
    },
    function response() {
      return { ok: false };
    },
  ],
});
