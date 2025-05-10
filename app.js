const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const PORT = config.get("PORT") || 3000;

const indexRouter = require("./routes/index.routes");

const app = express();

app.use(express.json());

app.use("/api", indexRouter); // backend

async function start(params) {
  try {
    const uri = config.get("dbUri");
    await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log(`Server started at: http:localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
