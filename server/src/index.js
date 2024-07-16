import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/users.js";
import { coachesRouter } from "./routes/coaches.js";

const app = express();

app.use(cors()); 
app.use(express.json());


app.use("/auth", userRouter);
app.use("/coach", coachesRouter); 

mongoose.connect("mongodb+srv://arronpirku:nokiaE66@onlinegym.zqfhios.mongodb.net/OnlineGym?retryWrites=true&w=majority&appName=OnlineGym")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => console.log("Server started on port 3001"));
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
