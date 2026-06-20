import * as bcrypt from 'bcrypt';

export const encryptPassword = async (
  plaintextPassword: string,
): Promise<string> => bcrypt.hash(plaintextPassword, 10);

export const comparePassword = async (
  plaintextPassword: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(plaintextPassword, hash);
