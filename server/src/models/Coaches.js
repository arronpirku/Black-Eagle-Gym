import mongoose from "mongoose";

const coachesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  program: [
    {
      type: String,
      required: true,
    },
  ],
  instructions: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },
  freeTime: {
    type: Number,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const coachesModel = mongoose.model("coaches", coachesSchema);