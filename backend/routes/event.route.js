import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  createEvent,
  deleteEvent,
  getEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
