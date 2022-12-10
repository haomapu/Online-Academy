//Import Router
import searchPageRouter from "./routes/searchPage.route.js";
import express from "express";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import dotenv from "dotenv";
import mongoose from "mongoose";
import homepageRouter from "./routes/homepage.route.js";
import detailsRouter from "./routes/details.route.js";

//Const variable
const app = express();
app.use("/public", express.static("public"));

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

// Connect MongoDB
dotenv.config();
mongoose.connect((process.env.MONGODB_URL), () => {
    console.log("Connected to MongoDB");
});

//Set up bootstrap
app.use(
    "/css",
    express.static(
        path.join(__dirname, "..", "node_modules/bootstrap/dist/css")
    )
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
    })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//Router
app.use("/", mainRouter);
app.use("/test", homepageRouter);
app.use("/details", detailsRouter);

//Start App
app.listen(PORT, function () {
    console.log(`Online Academy listening at http://localhost:${PORT}`);
});
