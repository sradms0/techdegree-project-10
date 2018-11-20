'use strict';

const express = require('express');
const router = express.Router();

// helpers
const setTableHeaders = require('../templatePrep').setTableHeaders;
const setTitle = require('../templatePrep').setTitle;
const sliceUrl = require('../templatePrep').sliceUrl;

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
