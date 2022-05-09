const express = require("express");
require("./logs/logger") // winston;

const userRoutes = require("./routes/users");
const errorHandler = require("./controllers/error");

// create app
const app = express();

// custom middlewares
app.use(express.json());

// app middlewares
app.use("/api/v1/users", userRoutes);

// error middleware
app.use(errorHandler);

// Not Found page
app.use("*", (req,res) =>res.json("Page Not Found!"))

// server
const PORT = 5000;
app.listen(PORT, () => console.log("App is running"));