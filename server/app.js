const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const feedRoutes = require("./routes/feedRoutes");
const myRecipeRoutes = require("./routes/myRecipeRoutes");
const userRoutes = require("./routes/userRoutes");
const webzineRoutes = require("./routes/webzineRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadsMyRecipe", express.static(path.join(__dirname, "uploadsMyRecipe")));
app.use("/webzineUploads", express.static(path.join(__dirname, "webzineUploads")));

app.use("/auth", authRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/feeds", feedRoutes);
app.use("/myRecipe", myRecipeRoutes);
app.use("/users", userRoutes);
app.use("/webzines", webzineRoutes);
app.use("/likes", likeRoutes);

connectDB();

module.exports = app;
