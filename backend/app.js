const express = require("express");
const morgan = require("morgan");

//security purpose
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const xss = require("xss");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

const app = express();

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hpur",
});

app.use("/tawk", limiter);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(mongoSanitize());
// app.use(xss());

app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

module.exports = app;
