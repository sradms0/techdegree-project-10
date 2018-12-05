'use strict';

const express = require('express');
const { sequelize: {models} } = require('../models');

// helpers
const argsBuilder   = require('../utils/args-builder');
const queryBuilder  = require('../utils/query-builder');
const rowsParser    = require('../utils/rows-parser');

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
    const args = argsBuilder(req, res, 'table');
    queryBuilder(models, args.subject, args.type)
    .then(data => {
        const rows = rowsParser(data, args.subject, args.type);
        args.rows = rows;
        res.render('page', args);
    })
});

// routes for forms
router.get(/new$/, (req, res) => {
    const args = argsBuilder(req, res, 'form')
    const query = queryBuilder(models, args.subject, args.type);

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
    id = null;
});
router.post(/new$/, (req, res) => {
    const {subject} = argsBuilder(req);
    models[subject].create(req.body)
    .then(entity => {
        let url = `/${subject}/details/${entity.id}`;
        if (subject === 'loans') url = '/loans/all';
        res.redirect(url);
    })
    .catch(error => console.log(error));
    
});


router.get(/details$|return$/, (req, res) => {
    const args = argsBuilder(req, res, 'form')
    const query = queryBuilder(models, args.subject, args.type, id);

    if (!id) return res.redirect(`${req.baseUrl}/all`);    

    if (args.type === 'return') {
        query.then(data => {
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
    }
});
router.post(/details$|return$/, (req, res) => {
    const {subject} = argsBuilder(req);
    models[subject].findByPk(id)
    .then(entity => {
        entity.update(req.body);
        res.redirect(`/${subject}/details/${entity.id}`);
    })
    .catch(error => console.log(error));
});


module.exports = router;
