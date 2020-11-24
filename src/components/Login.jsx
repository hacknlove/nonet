import { useOnGet, set } from 'onget';
import useKMF from 'kissmyform';
import clsx from 'clsx';
import kissmyhash from 'kissmyhash';

function close() {
  set('fast://login'); set('fast://login/state');
}

function siteValidation({ value, errors }) {
  errors.empty = !value;
  errors.invalid = !value.match(/^$|^([0-9a-z-]+\.?)+$/i);
}

function siteSubmit({ site }) {
  if (site === process.env.NEXT_PUBLIC_SITE) {
    set('fast://login/state', {
      Dialog: Password,
      site,
    });
  }
}

function Site({ callback }) {
  const {
    handleSubmit, inputControl, state: { hasErrors, errors },
  } = useKMF({ beforeChange: siteValidation, context: { callback } });

  return (
    <form onSubmit={handleSubmit(siteSubmit)} className={clsx('dialog', { hasErrors })}>
      <h1>Entrar</h1>
      <label>
        Sitio
      </label>
      <input
        autoFocus
        placeholder="example.com/path"
        {...inputControl('site')}
      />
      <button disabled={Boolean(hasErrors)} type="submit">Siguiente</button>
      {
        errors.empty && <p> Introduce el sitio con el que quieres entrar </p>
      }
      {
        errors.invalid && <p> Lo que has introducido no se parece a un dominio </p>
      }
    </form>
  );
}

function passwordValidation({ value, errors }) {
  errors.empty = !value;
}

async function passwordSubmit({ password }) {
  set('fast://login/state', {
    Dialog: () => (
      <div className="dialog">
        <h1>Cargando...</h1>
      </div>
    ),
  });

  const request = await fetch('/api/login/password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      password: kissmyhash(password + process.env.NEXT_PUBLIC_SECRET, { length: process.env.NEXT_PUBLIC_PASSWORD_HASH_LENGTH }),
    }),
  }).catch(() => ({ ok: false }));

  if (request.ok === false) {
    return set('fast://login/state', {
      Dialog: () => (
        <div className="dialog">
          <h1>Error</h1>
          <p>Error indeterminado en el servidor</p>
          <button type="button" onClick={() => set('fast://login/state', {})}>Atrás</button>
        </div>
      ),
    });
  }

  const json = await request.json().catch({ error: 'Error indeterminado en el servidor' });

  if (json.error) {
    return set('fast://login/state', {
      Dialog: () => (
        <div className="dialog">
          <h1>Error</h1>
          <p>{json.error}</p>
          <button type="button" onClick={() => set('fast://login/state', {})}>Atrás</button>
        </div>
      ),
    });
  }

  set('localseal://user', json);

  return set('fast://login/state', {
    Dialog: () => (
      <div className="dialog">
        <h1>Autentificado como</h1>
        <p>{json.site}</p>
        <button type="button" onClick={close}>Aceptar</button>
      </div>
    ),
  });
}

function Password({ callback }) {
  const { site } = useOnGet('fast://login/state');

  const {
    handleSubmit, inputControl, state: { hasErrors },
  } = useKMF({ beforeChange: passwordValidation, context: { callback } });

  return (
    <form onSubmit={handleSubmit(passwordSubmit)} className={clsx('dialog', { hasErrors })}>
      <h1>{site}</h1>
      <label>
        Contraseña
      </label>
      <input
        autoFocus
        placeholder="#-sEkr333tº*"
        {...inputControl('password')}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default function LoginWrapper() {
  const callback = useOnGet('fast://login');
  const { Dialog = Site } = useOnGet('fast://login/state') || {};

  if (!callback) {
    return null;
  }

  return (
    <>
      <div className="fullScreenWrapper">
        <div className="fullScreenDim" onClick={close} />
        <Dialog callback={callback} />
      </div>
    </>
  );
}
