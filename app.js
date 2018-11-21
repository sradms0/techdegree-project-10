#!/usr/bin/env node

'use strict';

const { sequelize } = require('./models');

const express = require('express');

const app = express();

app.use('/static', express.static('public'));

app.set('view engine', 'pug');

const mainRoutes = require('./routes');
const infoRoutes = require('./routes/info');
app.use(mainRoutes);
// dynamically set base routes
app.use(/\/books|\/patrons|\/loans/, infoRoutes);

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'));
});



