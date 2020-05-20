// import dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// establish dynamic port for deployment and localhost
const PORT = process.env.PORT || 3000;

// create instance of express
const app = express();

// determine run environment
app.use(logger("dev"));

// compression for web performance
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use public folder for frontend html
app.use(express.static("public"));

// connect to database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

// host on port 
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});