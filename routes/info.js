'use strict';

const express = require('express');
const { sequelize: {models} } = require('../models');

// helpers
const templateArgs = require('../templateArgs');
const queryBuilder = require('../queryBuilder');
const rowsParser = require('../rowsParser');

const router = express.Router();
let id = null;

router.get('/', (req, res) => {
    // redirect to 'all' filter of subject (base url that was entered)
    res.redirect(`${req.baseUrl}/all`);
});
router.get('/details/:id', (req, res) => {
    id = req.params.id;
    res.redirect(`${req.baseUrl}/details`);
});

// create dynamic routes
router.get('/all$|overdue$|checked$/', (req, res) => {
    const args = templateArgs(req, res, 'table');
    queryBuilder(models, args.subject, args.type)
    .then(data => {
        const rows = rowsParser(data, args.subject, args.type);
        args.rows = rows;
        res.render('page', args);
    })
});

router.get(/new$|details$/, (req, res) => {
    const args = templateArgs(req, res, 'form')
    if (args.type === 'details') {
        if (!id) return res.redirect(`${req.baseUrl}/all`);    
        const queries = queryBuilder(models, args.subject, args.type, id)
        queries.entity.then(data => {
            args.row = rowsParser(data, args.subject, args.type);
        });
        queries.loans.then( data => {
            args.rows = rowsParser(data, 'loans', 'all');
            res.render('page', args);
        });
    }
    else res.render('page', args);
    
})

module.exports = router;
