import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  createCharacter,
  deleteCharacter,
  getCharactersAndStats,
  getCharacterById,
  updateCharacter,
} from "../controllers/character.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getCharactersAndStats);
router.get("/:id", getCharacterById);
router.post("/", createCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

export default router;
