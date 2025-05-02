import mongoose from "mongoose";
import Character from "../models/character.model.js";

// utilizes query to return characters with specified hair color & also returns stats
export const getCharactersAndStats = async (req, res) => {
  const user_id = req.user._id;
  const { haircolor, ids, includeStats } = req.query;

  try {
    let query = { user_id };

    if (ids) {
      const idArray = ids.split(",");
      query._id = { $in: idArray };
    }

    if (haircolor && haircolor !== "") query.haircolor = haircolor;

    const characters = await Character.find(query).sort({ createdAt: -1 });

    let stats = null;
    if (includeStats === "true" && characters.length > 0) {
      const aggregation = await Character.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            maxHeight: { $max: "$height" },
            minHeight: { $min: "$height" },
            avgAge: { $avg: "$age" },
          },
        },
      ]);
      stats = aggregation[0];
    }

    res.status(200).json({ success: true, data: characters, stats });
  } catch (error) {
    console.error("Error in fetching characters and stats:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCharacterById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Character Id" });
  }

  try {
    const character = await Character.findById(id);
    if (!character) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }
    res.status(200).json({ success: true, data: character });
  } catch (error) {
    console.log("Error in fetching character:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCharacter = async (req, res) => {
  const {
    name,
    gender,
    race,
    age,
    haircolor,
    hairtexture,
    eyecolor,
    height,
    weight,
  } = req.body; // user will send this data

  if (
    !name ||
    !gender ||
    !race ||
    !age ||
    !haircolor ||
    !hairtexture ||
    !eyecolor ||
    !height ||
    !weight
  ) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const user_id = req.user._id;
    const character = await Character.create({
      name,
      gender,
      race,
      age,
      haircolor,
      hairtexture,
      eyecolor,
      height,
      weight,
      user_id,
    });
    res.status(200).json({ success: true, data: character });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Error in Create character:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCharacter = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Character Id" });
  }

  try {
    const updatedCharacter = await Character.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );

    res.status(200).json({ success: true, data: updatedCharacter });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Character Id" });
  }

  try {
    await Character.findOneAndDelete({ _id: id });
    res.status(200).json({ success: true, message: "Character deleted" });
  } catch (error) {
    console.log("Error in deleting character:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
