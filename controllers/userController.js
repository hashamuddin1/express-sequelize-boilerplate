const { User } = require("../models");
const bcrypt = require("bcrypt");
const {
  createUserSchema,
  updateUserSchema,
} = require("../utils/validators/userValidator");
const generateToken = require("../utils/validators/generateJwtToken");

exports.createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, dob } = value;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
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
      message: "User created successfully",
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userData = await User.findOne({ where: { id: req.user.id } });
    return res.status(201).json({
      message: "User fetch successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, password, dob } = value;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (dob) updateFields.dob = dob;
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await User.update(updateFields, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.destroy({ where: { id: userId } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
