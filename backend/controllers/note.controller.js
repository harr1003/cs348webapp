import mongoose from "mongoose";
import Note from "../models/note.model.js";

export const getNotes = async (req, res) => {
  const user_id = req.user._id;
  const { character_id, event_id } = req.query;

  // query to get by char or event
  const query = { user_id };
  if (character_id) query.character_id = character_id;
  if (event_id) query.event_id = event_id;

  try {
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    console.log("Error in fetching notes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Note Id" });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    console.log("Error in fetching note:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createNote = async (req, res) => {
  const { title, description, event_id, character_id } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const user_id = req.user._id;
    const note = await Note.create({
      title,
      description,
      event_id,
      character_id,
      user_id,
    });
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Error in Create note:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Note Id" });
  }

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    console.log("Char:", updatedNote);

    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Note Id" });
  }

  try {
    await Note.findByIdAndDelete({ _id: id });
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.log("Error in deleting note:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
