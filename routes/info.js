'use strict';

const express = require('express');
const { sequelize: {models} } = require('../models');

// helpers
const templateArgs  = require('../utils/templateArgs');
const queryBuilder  = require('../utils/queryBuilder');
const rowsParser    = require('../utils/rowsParser');

const router = express.Router();
let id = null;

router.get('/', (req, res) => {
    // redirect to 'all' filter of subject (base url that was entered)
    res.redirect(`${req.baseUrl}/all`);
});
router.get(/(details|return)\/(\d+)/, (req, res) => {
    id = req.params[1];
    res.redirect(`${req.originalUrl.slice(0,-id.length - 1)}`);
});

// routes for viewing tables
router.get('/all$|overdue$|checked$/', (req, res) => {
    const args = templateArgs(req, res, 'table');
    queryBuilder(models, args.subject, args.type)
    .then(data => {
        const rows = rowsParser(data, args.subject, args.type);
        args.rows = rows;
        res.render('page', args);
    })
});

// routes for forms
router.get(/new$|details$|return$/, (req, res) => {
    const args = templateArgs(req, res, 'form')
    const query = queryBuilder(models, args.subject, args.type, id);

    if (!id && (args.type === 'return' || args.type === 'details')) 
        return res.redirect(`${req.baseUrl}/all`);    

    // existing forms
    if (args.type === 'return') {
        query.then(data => {
            console.log(args.type);
            args.row = rowsParser(data, args.subject, args.type);
            res.render('page', args);
        });
    } else if (args.type === 'details') {
        query.entity.then(data => {
            args.row = rowsParser(data, args.subject, args.type);
        });
        query.loans.then( data => {
            args.rows = rowsParser(data, 'loans', 'all');
            res.render('page', args);
        });
    // new forms
    } else {
        if (args.subject === 'loans'){ 
            args.rows = {};
            query.books.then(data => {
                args.rows.books = rowsParser(data, 'books', 'all');
            });
            query.patrons.then(data => {
                args.rows.patrons = rowsParser(data, 'patrons', 'all');
                res.render('page', args);
            });
        } else res.render('page', args);
    } 
    id = null;
    
})

module.exports = router;
