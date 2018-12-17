'use strict';

const express                           = require('express');
const querystring                       = require('querystring');
const { Op }                            = require('sequelize');
const { sequelize: {models} }           = require('../models');
const bookArgs                          = require('../utils/book-args');
const loanArgs                          = require('../utils/loan-args');
const {checkAttrs, collectMsgs}         = require('../utils/error-form');
const {range, perPage}                  = require('../utils/pagination');
const {books} = models;

const router = express.Router();

router.get(/(\/|all|return|details)$/, (req, res) => res.redirect('/books/all/1'));
router.get('/overdue', (req, res) => res.redirect('/books/overdue/1'));
router.get('/checked', (req, res) => res.redirect('/books/checked/1'))

router.get('/all/:page', (req, res) => {
    const page = req.params.page;
    books.count()
    .then(total => {
        books.findAll(range(page))
        .then(data => res.render('books/table', {data, total, page, perPage, filter: 'All'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/overdue/:page', (req, res) => {
    const page = req.params.page;
    const includes = {include: bookArgs.overdue()};
    books.count(includes)
    .then(total => {
        books.findAll({ ...includes, ...range(req.params.page) })
        .then(data => res.render('books/table', {data, total, page, perPage, filter: 'Overdue'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/checked/:page', (req, res) => {
    const page = req.params.page;
    const includes = {include: bookArgs.checked()};
    books.count(includes)
    .then(total => {
        books.findAll({ ...includes, ...range(req.params.page) })
        .then(data => res.render('books/table', {data, total, page, perPage, filter: 'Checked Out'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/details/:id', (req, res) => {
    const pk            = req.params.id;
    const associates    = loanArgs.associates();
    associates[0].where = {id: pk};

    books.findByPk(pk)
    .then(bookData => {
        models.loans.findAll({include: associates})
        .then(loanData => {
            res.render(
                'books/form/detail', { 
                    bookData: bookData.dataValues, 
                    loanData,
                    attrs: checkAttrs(req.query, 'book')
                }
            )
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});
router.post('/details/:id', (req, res) => {
    const pk = req.params.id;
    books.findByPk(pk)
    .then(book => {
        book.update(req.body)
        .then(() => res.redirect('/books/all'))
        .catch(err => {
            res.redirect(
                `/books/details/${pk}?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
            );
        });

    })
    .catch(err => console.log(err));
})

router.get('/return/:id', (req, res) => {
    const pk = req.params.id;
    models.loans.findAll({
        include: loanArgs.associates(),
        where: {id: pk, returned_on: null}
    })
    .then(data => res.render('books/form/return', {data: data[0], attrs: checkAttrs(req.query, 'return')}))
    .catch(err => console.log(err));
});
router.post('/return/:id', (req, res) => {
    const pk = req.params.id;
    models.loans.findByPk(pk)
    .then(loan => {
        loan.update(req.body)
        .then(() => res.redirect('/loans/all'))
        .catch(err => {
            res.redirect(
            `/books/return/${pk}?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
            );
        })
    })
    .catch(err => console.log(err));
})

router.get('/new', (req,res) => {
    res.render('books/form/new', {attrs: checkAttrs(req.query, 'book')});
});
router.post('/new', (req,res) => {
    books.create(req.body)
    .then(() => res.redirect('/books/all'))
    .catch(err => {
        res.redirect(
        `/books/new?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
        );
    })
});

module.exports = router;