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

const mainRoutes = require('./routes');
const managerRoutes = require('./routes/manager');
app.use(mainRoutes);
// dynamically set base routes
app.use(/\/books|\/patrons|\/loans/, managerRoutes);

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'));
});



