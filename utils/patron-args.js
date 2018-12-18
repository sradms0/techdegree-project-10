'use strict';

const { sequelize: {models} }   = require('../models');
const { Op }                    = require('sequelize');

const searchParams = containing => {
    return { 
        [Op.or]: {
            first_name: { [Op.like]: `%${containing}%` },
            last_name:  { [Op.like]: `%${containing}%` },
            address:    { [Op.like]: `%${containing}%` },
            email:      { [Op.like]: `%${containing}%` },
            library_id: { [Op.like]: `%${containing}%` },
            zip_code:   { [Op.like]: `%${containing}%` }
        }
    }
}

module.exports.searchParams = searchParams;
