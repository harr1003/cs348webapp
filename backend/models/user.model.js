import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.login = async function (identifier, password) {
  if (!identifier || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password username email");

  if (!user) {
    throw Error("Invalid login credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid login credentials");
  }

  return user;
};

userSchema.statics.signup = async function (username, email, password) {
  //validation
  if (!email || !username || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });

  if (emailExists) {
    throw Error("Email already in use");
  } else if (usernameExists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ username, email, password: hash });
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
