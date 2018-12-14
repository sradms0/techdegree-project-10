'use strict';

const express                           = require('express');
const { Op }                            = require('sequelize');
const { sequelize: {models} }           = require('../models');
const bookArgs                          = require('../utils/book-args');
const loanArgs                          = require('../utils/loan-args');
const {books} = models;

const router = express.Router();

router.get(/(\/|return|details)$/, (req, res) => res.redirect('/books/all'));

router.get('/all', (req, res) => {
    books.findAll()
    .then(data => res.render('books/table', {data, filter: 'All'}))
    .catch(err => console.log(err));
});

router.get('/overdue', (req, res) => {
    books.findAll({include: bookArgs.overdue()})
    .then(data => res.render('books/table', {data, filter: 'Overdue'}))
    .catch(err => console.log(err));
});

router.get('/checked', (req, res) => {
    books.findAll({include: bookArgs.checked()})
    .then(data => res.render('books/table', {data, filter: 'Checked Out'}))
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
                    loanData
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
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

router.get('/return/:id', (req, res) => {
    const pk = req.params.id;
    models.loans.findAll({
        include: loanArgs.associates(),
        where: {id: pk, returned_on: null}
    })
    .then(data => res.render('books/form/return', {data: data[0]}))
    .catch(err => console.log(err));
});
router.post('/return/:id', (req, res) => {
    const pk = req.params.id;
    models.loans.findByPk(pk)
    .then(loan => {
        loan.update(req.body)
        .then(() => res.redirect('/loans/all'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

router.get('/new', (req,res) => res.render('books/form/new'));
router.post('/new', (req,res) => {
    books.create(req.body)
    .then(() => res.redirect('/books/all'))
    .catch(err => console.log(err));
});

module.exports = router;
