'use strict';
module.exports = (sequelize, DataTypes) => {
  const patrons = sequelize.define('patrons', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'First Name Required'},
        is: {
          args: /^[a-z]+$/i, 
          msg: 'Valid First Name Required: Letters Only'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Last Name Required'},
        is: {
          args: /^[a-z]+$/i, 
          msg: 'Valid Last Name Required: Letters Only'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Address Required'},
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Email Required'},
        isEmail: {msg: 'Valid Email Required'}
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Library ID Required'},
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {msg: 'Zip Code Required'},
        isInt: {msg: 'Valid Zip Code Required'}
      }
    }
  }, {});
  patrons.associate = function(models) {
    patrons.hasMany(models.loans, {foreignKey:'patron_id'});
  };
  return patrons;
};
