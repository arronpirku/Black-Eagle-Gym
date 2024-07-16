import express from "express";
import mongoose from "mongoose";
import { coachesModel } from "../models/Coaches.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await coachesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/", verifyToken, async (req, res) => {
  const coach = new coachesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    program: req.body.program,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    freeTime: req.body.freeTime,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await coach.save();
    res.status(201).json({
      createdCoach: {
        name: result.name,
        program: result.program,
        instructions: result.instructions,
        imageUrl: result.imageUrl,
        freeTime: result.freeTime,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:coachId", async (req, res) => {
  try {
    const result = await coachesModel.findById(req.params.coachId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:coachId", async (req, res) => {
  try {
    const updatedCoach = await coachesModel.findByIdAndUpdate(
      req.params.coachId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCoach);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete("/:coachId/unsave", async (req, res) => {
  const { userId, coachId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.savedCoaches.pull(coachId); 
    await user.save();
    res.status(204).end();
  } catch (err) {
    res.status(500).json(err);
  }
});



router.put("/", async (req, res) => {
  const { userId, coachId } = req.body; 
  try {
    const coach = await coachesModel.findById(coachId); 
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.savedCoaches.includes(coachId)) {
      user.savedCoaches.push(coachId);
      await user.save();
    }
    res.status(201).json({ savedCoaches: user.savedCoaches });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});



router.get("/savedCoaches/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(200).json({ savedCoaches: user?.savedCoaches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});


router.get("/savedCoaches/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedCoaches = await coachesModel.find({
      _id: { $in: user.savedCoaches },
    });
    res.status(200).json({ savedCoaches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

export { router as coachesRouter };
