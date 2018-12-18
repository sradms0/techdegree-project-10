'use strict';

const express                   = require('express');
const querystring               = require('querystring');
const { Op }                    = require('sequelize');
const { sequelize: {models} }   = require('../models');
const loanArgs                  = require('../utils/loan-args');
const patronArgs                = require('../utils/patron-args');
const {checkAttrs, collectMsgs} = require('../utils/error-form');
const {range, perPage}          = require('../utils/pagination');
const {patrons} = models;

const router = express.Router();

router.get(/(\/|all|details)$/, (req, res) => res.redirect('/patrons/all/1'));

// GET ALL: SEARCH
router.get('/all/search', (req, res) => {
    const {containing, page} = req.query;
    const includes  = { where: patronArgs.searchParams(containing) };
    patrons.count(includes)
    .then(total => {
        patrons.findAll({ ...includes, ...range(page)})
        .then(data => {
            res.render('patrons/table', {
                    data, total, page, perPage, 
                    search: true, containing,
                    filter: 'All'
                })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/patrons/all/1');
        });
    })
    .catch(err => {
        console.log(err)
        res.redirect('/');
    });
});
// GET ALL
router.get('/all/:page', (req, res) => {
    const page = req.params.page
    patrons.count()
    .then(total => {
        patrons.findAll(range(page))
        .then(data => res.render('patrons/table', {data, total, page, perPage}))
        .catch(err => {
            console.log(err)
            res.redirect('/patrons/all/1');
        });
    })
    .catch(err => {
        console.log(err)
        res.redirect('/');
    });
});
// POST SEARCH
router.post('/all/search', (req, res) => {
    const {containing} = req.body;
    res.redirect(`/patrons/all/search?containing=${containing}&page=1`)
});

// GET DETAILS
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
        .catch(err => {
            console.log(err)
            res.redirect('/patrons/all/1');
        });
    })
    .catch(err => {
        console.log(err)
        res.redirect('/');
    });
});
//POST DETAILS
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
    .catch(err => {
        console.log(err)
        res.redirect('/');
    });
});

// GET NEW
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
