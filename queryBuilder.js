'use strict';

const { Op } = require('sequelize');

module.exports = (models, subject, type) => {
    const model = models[subject];
    const find = {
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
                        )
        },
        'patrons': {
            'all':      () => model.findAll()
        },
        'loans': {
            attributes: [
                'loaned_on',
                'return_by',
                'returned_on'
            ],
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
                                attributes: find.loans.attributes,
                                include: find.loans.associates
                            })
                        ),
            'overdue':  () => (
                            model.findAll({
                                attributes: find.loans.attributes,
                                include: find.loans.associates,
                                where: find.overdue
                            })
                        ),
            'checked':  () => (
                            model.findAll({
                                attributes: find.loans.attributes,
                                include: find.loans.associates,
                                where: find.checked
                            })
                        )
        }
    }
    return find[subject][type]();
}
