'use strict';

const { Op } = require('sequelize');

module.exports = (models, subject, type, pk=undefined) => {
    const model = models[subject];
    const find = {
        details: () => find.loans.details(),
        overdue: {
            return_by: {
                [Op.lt]: new Date()
            },
            returned_on: null
        }, 
        checked: {returned_on: null},

        'books': {
            'all':      () => model.findAll(),
            'overdue':  () => (
                            model.findAll({
                                include: [{ 
                                    model: models.loans, 
                                    attributes: [],
                                    where: find.overdue,
                                    required: true 
                                }]
                            })
                        ),
            'checked':  () => (
                            model.findAll({
                                include: [{ 
                                    model: models.loans, 
                                    attributes: [],
                                    where: find.checked,
                                    required: true 
                                }]
                            })
                        ),
            'details':  () => find.details(),
            'new':      () => null,
            'return':   () => (
                            models.loans.findAll({
                                include: find.loans.associates,
                                where: {id: pk}
                            })
                        )
        },
        'patrons': {
            'all':      () => model.findAll(),
            'details':  () => find.details(),
            'new':      () => null,
            'return':   () => null
        },
        'loans': {
            associates: [{
                    model: models.books,
                    attributes: ['title'],
                    required:true
                }, {
                    model: models.patrons,
                    attributes: ['first_name', 'last_name'],
                    required:true
                }
            ],

            'all':      () => (
                            model.findAll({
                                include: find.loans.associates
                            })
                        ),
            'overdue':  () => (
                            model.findAll({
                                include: find.loans.associates,
                                where: find.overdue
                            })
                        ),
            'checked':  () => (
                            model.findAll({
                                include: find.loans.associates,
                                where: find.checked
                            })
                        ),
            'details': () => {
                            const associate = (subject === 'books') ? 0 : 1;
                            find.loans.associates[associate].where = {id: pk};
                            return ({
                                entity: model.findByPk(pk),
                                loans:  models.loans.findAll({
                                            include: find.loans.associates
                                    })
                            })
                        },
            'new':    () => ({
                            books:   models.books.findAll(),
                            patrons: models.patrons.findAll()
                        }),
            'return':   () => null
        }
    }
    return find[subject][type]();
}
