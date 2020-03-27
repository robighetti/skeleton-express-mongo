import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import AuthConfig from '../config/auth';
import User from '../models/user.model';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Schema validation fails' });
    }

    const { email, password } = req.body;

    const user = await (await User.findOne({ email })).populated('avatar');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { _id, name, mobile, cpf, avatar } = user;

    return res.json({
      user: {
        _id,
        name,
        mobile,
        cpf,
        avatar,
      },
      token: jwt.sign({ _id }, AuthConfig.secret, {
        expiresIn: AuthConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
