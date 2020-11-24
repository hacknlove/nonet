import { encrypt, decrypt } from 'kissmycipher';

export function checkCredentialsFull ({ control: { done } }, { headers: { authorization } }) {
  if (!authorization.startsWith('Bearer ')) {
    return done({}, 401);
  }

  const token = decrypt(process.env.SECRET, authorization.substr('Bearer '.length));
  console.log(token)
}
