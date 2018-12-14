'use strict';

const express                   = require('express');
const { sequelize: {models} }   = require('../models');
const loanArgs                  = require('../utils/loan-args');
const {patrons} = models;

const router = express.Router();

router.get(/(\/|details)$/, (req, res) => res.redirect('/patrons/all'));

router.get('/all', (req, res) => {
    patrons.findAll()
    .then(data => res.render('patrons/table', {data}))
    .catch(err => console.log(err));
});

router.get('/details/:id', (req, res) => {
    const pk            = req.params.id;
    const associates    = loanArgs.associates();
    associates[1].where =  {id: pk};

    patrons.findByPk(pk)
    .then(patronData => {
        models.loans.findAll({include: associates})
        .then(loanData => {
            res.render(
                'patrons/form/detail', { 
                    patronData: patronData.dataValues, 
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
    patrons.findByPk(pk)
    .then(patron => {
        patron.update(req.body)
        .then(() => res.redirect('/patrons/all'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/new', (req, res) => res.render('patrons/form/new'))
router.post('/new', (req, res) => {
    patrons.create(req.body)
    .then(() => res.redirect('/patrons/all'))
    .catch(err => console.log(err));
});

module.exports = router;
