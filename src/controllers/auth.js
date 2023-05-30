import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUsed = await User.findOne({ username });

    if (isUsed) {
      return res.send({
        message: 'This username is already taken'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    await newUser.save();

    return res.send({
      newUser,
      token,
      message: 'Registration is successful'
    })
  } catch (error) {
    console.log(error)
    return res.send({ message: 'Registration error' })
  }
}

// Login User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.send({ message: 'Wrong username or passsword' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user?.password);

    if (!isPasswordCorrect) {
      return res.send({ message: 'Wrong username or passsword' });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    return res.send({
      token,
      user,
    });
  } catch (error) {
    return res.send({ message: 'Login error' })
  }
}

// Get User

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.send({
        messsage: "User does not exist",
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    return res.send({
      user,
      token,
    })

  } catch (error) {
    return res.send({ message: 'No Access!' })
  }
}