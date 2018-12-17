#!/usr/bin/env node

'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const { sequelize } = require('./models');

const app = express();

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

const index     = require('./routes');
const books     = require('./routes/books');
const patrons   = require('./routes/patrons');
const loans     = require('./routes/loans');

app.use(index);
app.use('/books',    books);
app.use('/patrons',  patrons);
app.use('/loans',    loans);

// handle invalid routes:
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
},
(err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error', err);
    console.log(`${err.message} (${err.status})`);
});

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'));
});



