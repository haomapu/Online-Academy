//Import Router
import express from "express";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import hbs_sections from "express-handlebars-sections";

//Import Router
import mongoose from "mongoose";
import homepageRouter from "./routes/homepage.route.js";
import detailsRouter from "./routes/details.route.js";
import searchPageRouter from "./routes/searchPage.route.js";
import loginPageRouter from "./routes/loginPage.route.js";

//Const variable
const app = express();
app.use("/public", express.static("public"));

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8080;

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

//Default homepage
app.get("/", (req, res) => {
    res.render("home");
});

//Router
app.use("/test", homepageRouter);
app.use("/details", detailsRouter);
app.use("/searchPage", searchPageRouter);
app.use("/login", loginPageRouter);

//Start App
app.listen(PORT, function () {
    console.log(`Online Academy listening at http://localhost:${PORT}`);
});
