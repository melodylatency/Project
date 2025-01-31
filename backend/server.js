import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const __dirname = path.resolve();

const app = express();

// Bode parser of req obj
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use("/api/users", userRoutes); // User express router, we are shortening the url

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running, port ${port}`));
