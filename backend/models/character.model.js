import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    race: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    haircolor: {
      type: String,
      required: true,
    },
    hairtexture: {
      type: String,
      required: true,
    },
    eyecolor: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    user_id: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Character = mongoose.model("Character", characterSchema);

export default Character;
