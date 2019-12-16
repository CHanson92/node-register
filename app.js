const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
    sassMiddleware({
        /* Options */
        src: path.join(__dirname, 'public/scss'),
        dest: path.join(__dirname, 'public'),
        outputStyle: 'compressed',
        sourceMap: true,
    })
);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;
