'use strict';

const express                   = require('express');
const querystring               = require('querystring');
const { sequelize: {models} }   = require('../models');
const loanArgs                  = require('../utils/loan-args');
const {checkAttrs, collectMsgs} = require('../utils/error-form');
const {range, perPage}          = require('../utils/pagination');
const {patrons} = models;

const router = express.Router();

router.get(/(\/|all|details)$/, (req, res) => res.redirect('/patrons/all/1'));

router.get('/all/:page', (req, res) => {
    const page = req.params.page
    patrons.count()
    .then(total => {
        patrons.findAll(range(page))
        .then(data => res.render('patrons/table', {data, total, page, perPage}))
        .catch(err => console.log(err));
    })
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
                    loanData,
                    attrs: checkAttrs(req.query, 'patron')
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
        .catch(err => {
            res.redirect(
                `/patrons/details/${pk}?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
            );
        });
    })
    .catch(err => console.log(err));
});

router.get('/new', (req, res) => res.render('patrons/form/new', {attrs: checkAttrs(req.query, 'patron')}));
router.post('/new', (req, res) => {
    patrons.create(req.body)
    .then(() => res.redirect('/patrons/all'))
    .catch(err => {
        res.redirect(
        `/patrons/new?${querystring.stringify(req.body)}&${querystring.stringify( {msgs: collectMsgs(err)} )}`
        );
    });
});

module.exports = router;
