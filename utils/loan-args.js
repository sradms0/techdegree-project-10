'use strict';

const { sequelize: {models} }   = require('../models');
const { Op }                    = require('sequelize');

// use inner join
const associates = () => {
    return [{
        model: models.books,
        required:true
    }, {
        model: models.patrons,
        required:true
    }];
};
const overdue = () => {
    return ({
        return_by: {
            [Op.lt]: new Date()
        },
        returned_on: null
    });

};
const checked = () => ({returned_on: null});

module.exports.associates  = associates;
module.exports.overdue     = overdue;
module.exports.checked     = checked;
