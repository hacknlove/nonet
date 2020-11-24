import { switchMethod } from 'server/app';
import { checkCredentialsFull } from 'server/auth';

export default switchMethod({
  POST: [
    {
      response: {
        ok: true,
      },
    },
    checkCredentialsFull,
    function response(req) {
      return { ok: false };
    },
  ],
});
