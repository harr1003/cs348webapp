import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  createNote,
  deleteNote,
  getNotes,
  getNoteById,
  updateNote,
} from "../controllers/note.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
