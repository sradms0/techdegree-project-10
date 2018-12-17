'use strict';

const express                   = require('express');
const querystring               = require('querystring');
const { Op }                    = require('sequelize');
const { sequelize: {models} }   = require('../models');
const loanArgs                  = require('../utils/loan-args');
const {checkAttrs, collectMsgs} = require('../utils/error-form');
const {range, perPage}          = require('../utils/pagination');
const {loans} = models;

const router = express.Router();

router.get(/(\/|all)$/,(req, res) => res.redirect('/loans/all/1'));
router.get('/overdue', (req, res) => res.redirect('/loans/overdue/1'));
router.get('/checked', (req, res) => res.redirect('/loans/checked/1'))

router.get('/all/:page', (req, res) => {
    const page = req.params.page;
    const includes = { include: loanArgs.associates() };
    loans.count(includes)
    .then(total => {
        loans.findAll({ ...includes, ...range(page) })
        .then(data => res.render('loans/table', {data, total, page, perPage, filter: 'All'}))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
});

router.get('/overdue/:page', (req, res) => {
    const page = req.params.page;
    const includes = { include: loanArgs.associates(), where: loanArgs.overdue() };
    loans.count(includes)
    .then(total => {
        loans.findAll({ ...includes, ...range(page) })
        .then(data => res.render('loans/table', {data, total, page, perPage, filter: 'Overdue'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/checked/:page', (req, res) => {
    const page = req.params.page;
    const includes = { include: loanArgs.associates(), where: loanArgs.checked() };
    loans.count(includes)
    .then(total => {
        loans.findAll({ ...includes, ...range(page) })
        .then(data => res.render('loans/table', {data, total, page, perPage, filter: 'Checked Out'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/new', (req, res) => {
    models.books.findAll()
    .then(bookData => {
        models.patrons.findAll()
        .then(patronData => res.render('loans/form/new', { bookData, patronData , attrs: checkAttrs(req.query, 'loan')}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});
router.post('/new', (req,res) => {
    loans.create(req.body)
    .then(() => res.redirect('/loans/all'))
    .catch(err => {
        res.redirect(
        `/loans/new?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
        );
    });
});

module.exports = router;
