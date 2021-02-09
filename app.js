// require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./routes/users");
const holdingsRouter = require("./routes/holdings");
const securitiesRouter = require("./routes/securities");
const plaidRouter = require("./routes/plaid")

const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept"
};

const app = express();

app.set('port', 8888)

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/users", usersRouter);
app.use("/holdings", holdingsRouter);
app.use("/plaid", plaidRouter)
// app.use("/securities", securitiesRouter);


module.exports = app;