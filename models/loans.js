'use strict';
module.exports = (sequelize, DataTypes) => {
  const isTodayOrBefore = value => {
    if (new Date(value) >=  new Date().setDate(new Date().getDate() + 1)) {
      throw new Error(`Date Exceeds Today`)
    }
  };
  const loans = sequelize.define('loans', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: {msg: 'Valid Date Required: Loaned On '},
        requiredDate: value => isTodayOrBefore(value)
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        isDate: {msg: 'Valid Date Required: Return By '}
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: {msg: 'Valid Date Required: Returned On '},
        requiredDate: value => isTodayOrBefore(value)
      }
    }
  }, {});
  loans.associate = function(models) {
    loans.belongsTo(models.books, {foreignKey: 'book_id'});
    loans.belongsTo(models.patrons, {foreignKey: 'patron_id'});
  };
  return loans;
};
