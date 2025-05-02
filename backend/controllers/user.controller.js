import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    //create token
    const token = createToken(user._id);

    res.status(200).json({ username: user.username, email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    //create token
    const token = createToken(user._id);

    res.status(200).json({ username: user.username, email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
