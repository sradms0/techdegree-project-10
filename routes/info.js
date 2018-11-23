'use strict';

const express = require('express');
const { sequelize: {models} } = require('../models');

// helpers
const {
    setTableHeaders,
    setTitle,
    sliceUrl 
} = require('../templatePrep');
const queryBuilder = require('../queryBuilder');
const rowsParser = require('../rowsParser');

const router = express.Router();

router.get('/', (req, res) => {
    // redirect to 'all' filter of subject (base url that was entered)
    res.redirect(`${req.baseUrl}/all`);
});

// create dynamic routes
router.get(/all|overdue|checked|new/, (req, res) => {
    const subject = sliceUrl(req.baseUrl);
    const type = sliceUrl(req.url);
    const title = setTitle(subject, type);
    const tableHeaders = setTableHeaders(subject);

    res.render('page', {title, subject, type, tableHeaders});
});

module.exports = router;
