'use strict';

const express                   = require('express');
const querystring               = require('querystring');
const { Op }                    = require('sequelize');
const { sequelize: {models} }   = require('../models');
const loanArgs                  = require('../utils/loan-args');
const {checkAttrs, collectMsgs} = require('../utils/error-form');
const {loans} = models;

const router = express.Router();

const parseDate = (string) => new Date(string).toISOString().slice(0,10);

router.get('/', (req, res) => res.redirect('/details/all'));

router.get('/all', (req, res) => {
    loans.findAll({ include: loanArgs.associates() })
    .then(data => res.render('loans/table', {data, filter: 'All'}))
    .catch(err => console.log(err))
});

router.get('/overdue', (req, res) => {
    loans.findAll({ include: loanArgs.associates(), where: loanArgs.overdue()})
    .then(data => res.render('loans/table', {data, filter: 'Overdue'}))
    .catch(err => console.log(err));
});

router.get('/checked', (req, res) => {
    loans.findAll({ include: loanArgs.associates(), where: loanArgs.checked()})
    .then(data => res.render('loans/table', {data, filter: 'Checked Out'}))
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
