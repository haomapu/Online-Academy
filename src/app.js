import express from 'express';
import { engine } from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path'


//Import Router
import homepageRouter from './routes/homepage.route.js'
import detailsRouter from './routes/details.route.js'


//Const variable
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 5000;


//Set up bootstrap
app.use('/css',express.static(path.join(__dirname ,'..', 'node_modules/bootstrap/dist/css')))
app.use('/js',express.static(path.join(__dirname ,'..', 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname ,'..', 'node_modules/jquery/dist')))

//Set up view engine
app.engine('hbs', engine({
  defaultLayout: 'main.handlebars'
  
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//Default homepage
app.get('/', (req, res) => {
    res.render('home');
});

//Router
app.use('/test', homepageRouter)
app.use('/details', detailsRouter)


//Start App
app.listen(PORT, function () {
  console.log(`Online Academy listening at http://localhost:${PORT}`);
});