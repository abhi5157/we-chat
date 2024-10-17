const { console } = require("inspector");
const app = require("./app");
const http = require("http");
// const dotenv = require("./config.env");
const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

// dotenv.config({path: "./config.env"  });

const server = http.createServer(app);

mongoose
  .connect(process.env.DBURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("DB Connection Successfully", conn);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`App run on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
