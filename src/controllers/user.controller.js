import * as Yup from 'yup';
import User from '../models/user.model';
import checkPassword from '../utils/checkPassword';

class UserController {
  async index(req, res) {
    const users = await User.find().populate('avatar');

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Schema validation fails' });
    }

    const { email, cpf, password: password_hash, name, mobile } = req.body;

    const userExists = await User.findOne({
      email: req.body.email,
    });

    if (userExists) {
      return res.status(400).json({ error: 'email already exists' });
    }

    const cpfExists = await User.findOne({
      cpf: req.body.cpf,
    });

    if (cpfExists) {
      return res.status(400).json({ error: 'cpf already exists' });
    }

    const { _id } = await User.create({
      email,
      cpf,
      name,
      mobile,
      password_hash,
    });

    return res.json({
      _id,
      name,
      mobile,
      cpf,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      name: Yup.string(),
      cpf: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Schema validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findById(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await checkPassword(req.userId, oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { _id, name, mobile, cpf, avatar } = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      {
        new: true,
      }
    ).populate('avatar');

    return res.json({
      _id,
      name,
      mobile,
      cpf,
      email,
      avatar,
    });
  }
}

export default new UserController();
