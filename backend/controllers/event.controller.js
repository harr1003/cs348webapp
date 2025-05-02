import mongoose from "mongoose";
import Event from "../models/event.model.js";
import { ObjectId } from "mongodb";
import { getRegularDB } from "../config/db.js";

export const getEvents = async (req, res) => {
  const user_id = req.user._id;

  if (!ObjectId.isValid(user_id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Event Id" });
  }
  try {
    const { db, collection, client } = await getRegularDB();
    if (!db) {
      return res
        .status(500)
        .json({ success: false, message: "Database not connected" });
    }

    const events = await collection
      .find({ user_id: new ObjectId(user_id) })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ success: true, data: events });
    client.close();
  } catch (error) {
    console.error("Error in fetching events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Not used yet
export const getEventById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("Error in fetching event:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, order } = req.body;

  if (!title || !description || !order) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const { db, collection, client } = await getRegularDB();
    if (!db) {
      return res
        .status(500)
        .json({ success: false, message: "Database not connected" });
    }
    const user_id = new ObjectId(req.user._id);

    const event = {
      title,
      description,
      order,
      user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(event);

    if (!result.insertedId) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create event" });
    }

    res
      .status(200)
      .json({ success: true, data: { _id: result.insertedId, ...event } });
    client.close();
  } catch (error) {
    console.error("Error in Create event:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const { db, collection, client } = await getRegularDB();
    if (!db) {
      return res
        .status(500)
        .json({ success: false, message: "Database not connected" });
    }
    const eventId = new ObjectId(id);

    const { _id, user_id, ...updateData } = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: eventId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const updatedEvent = await db
      .collection("events")
      .findOne({ _id: eventId });

    res.status(200).json({ success: true, data: updatedEvent });
    client.close();
  } catch (error) {
    console.error("Error in updating event:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const db = mongoose.connection.db;
    const eventId = new ObjectId(id);

    const result = await db
      .collection("events")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log("Error in deleting event:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
