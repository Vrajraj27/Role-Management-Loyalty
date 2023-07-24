import * as crypto from 'crypto';
const salt = 'ProfitFolioProject';

export const setPassword = (password: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

export const verifyPassword = (password: string, oldHash: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return hash === oldHash;
};
