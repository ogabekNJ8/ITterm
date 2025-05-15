const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

const PORT = config.get("PORT") || 3000;

const indexRouter = require("./routes/index.routes");
const errorHandingMiddleware = require("./middlewares/errors/error-handing.middleware");

process.on("uncaughtException", (exception) => {
  console.log("uncaughtException:", exception.message);
})

process.on("unhandledRejection", (rejection) => {
  console.log("UnhandledRejection:", rejection);
})

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", indexRouter); // backend

app.use(errorHandingMiddleware)  // eng oxirida

async function start() {
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
