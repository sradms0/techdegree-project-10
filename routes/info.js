'use strict';

const express = require('express');
const { sequelize: {models} } = require('../models');

// helpers
const templateArgs = require('../templateArgs');
const queryBuilder = require('../queryBuilder');
const rowsParser = require('../rowsParser');

const router = express.Router();

router.get('/', (req, res) => {
    // redirect to 'all' filter of subject (base url that was entered)
    res.redirect(`${req.baseUrl}/all`);
});

// create dynamic routes
router.get('/all$|overdue$|checked$/', (req, res) => {
    const args = templateArgs(req, res, 'table');
    queryBuilder(models, args.subject, args.type)
    .then(data => {
        const rows = rowsParser(data, args.subject);
        args.rows = rows;
        res.render('page', args);
    })
});

router.get(/new$/, (req, res) => {
    const args = templateArgs(req, res, 'form')
    res.render('page', args);
})

module.exports = router;
