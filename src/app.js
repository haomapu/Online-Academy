//Import general
import express from "express";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import numeral from 'numeral';

import passport from "passport";
//Inport router

import mainRouter from "./routes/main.route.js";
import courseRouter from "./routes/course.route.js";

//Const variable
const app = express();
app.use("/public", express.static("public"));

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

// Connect MongoDB
dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(passport.initialize());
//app.use(passport.session());

//Set up bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/js"))
);

//Set up view engine
app.engine(
  "hbs",
  engine({
    defaultLayout: "main.handlebars",
    section: hbs_sections(),
    helpers:{
      format_number(val) {
        return numeral(val).format('0,0');
      },
      format_date(date){
        return date.toLocaleString();
      }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Router
app.use("/", mainRouter);
app.use("/search", mainRouter);
app.use("/course", courseRouter);
//Start App
app.listen(PORT, function () {
  console.log(`Online Academy listening at http://localhost:${PORT}`);
});
