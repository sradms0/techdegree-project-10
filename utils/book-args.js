'use strict';

const { sequelize: {models} }   = require('../models');
const { Op }                    = require('sequelize');

const overdue = () => {
    return [{
        model:          models.loans, 
        attributes:     [],
        where:          { returned_on: null, return_by: { [Op.lt]: new Date() } },
        required:       true 
    }];
};
const checked = () => {
    return [{
        model:          models.loans, 
        attributes:     [],
        where:          { returned_on: null },
        required:       true 
    }];
};

const searchParams = containing => {
    return { 
        [Op.or]: {
            title:          { [Op.like]: `%${containing}%` },
            author:         { [Op.like]: `%${containing}%` },
            genre:          { [Op.like]: `%${containing}%` },
            first_published:{ [Op.like]: `%${containing}%` }
        }
    }
}

module.exports.overdue      =  overdue;
module.exports.checked      =  checked;
module.exports.searchParams =  searchParams;
