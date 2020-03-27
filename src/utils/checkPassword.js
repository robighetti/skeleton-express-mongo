import bcrypt from 'bcryptjs';

import User from '../models/user.model';

export default async function (userId, password) {
  const user = await User.findById(userId);

  const check = await bcrypt.compare(password, user.password_hash);

  return check;
}
