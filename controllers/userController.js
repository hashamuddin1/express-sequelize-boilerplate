const { User } = require('../models');
const bcrypt = require('bcrypt');
const { createUserSchema } = require('../utils/validators/userValidator');
const generateToken = require('../utils/validators/generateJwtToken');


exports.createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, dob } = value;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
    });

    const token = generateToken(user);

    const { password: _, ...userData } = user.toJSON();
    return res.status(201).json({
      message: 'User created successfully',
      user: userData,
      token,
    });;
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
