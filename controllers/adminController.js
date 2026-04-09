import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret123', {
    expiresIn: '30d'
  });
};

export const authAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerAdmin = async (req, res) => {
  // Only for setup purposes. Usually admin is initialized manually.
  const { username, password } = req.body;
  const userExists = await Admin.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }
  const admin = await Admin.create({ username, password });
  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};
