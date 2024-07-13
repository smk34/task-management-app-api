import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import router from "./src/routes/index.js";

dotenv.config();
const app = express();

//DB Connection
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB ERROR: ", err));

//Middlewares
app.use(express.json());
app.use(bodyParser.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(cors());

//Routes
app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "50mb" }));

app.use("/api/", router);

app.get("*", (req, res) => {
  res.status(200).json({
    Message: "Server is On",
  });
});

//PORT
const port = process.env.PORT || 8000;

//Starting a Server
app.listen(port, () => console.log(`app is running at ${port}`));
