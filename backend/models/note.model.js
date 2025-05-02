import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    event_id: {
      type: ObjectId,
      required: true,
    },
    character_id: {
      type: ObjectId,
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

const Note = mongoose.model("Note", noteSchema);

export default Note;
