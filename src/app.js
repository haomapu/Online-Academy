import express from 'express';
import { engine } from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import homepageRouter from './routes/homepage.route.js'


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
    res.render('home');
});

app.use('/test', homepageRouter)

const PORT = 5000;
app.listen(PORT, function () {
  console.log(`E-Commerce App listening at http://localhost:${PORT}`);
});