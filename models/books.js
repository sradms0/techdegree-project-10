'use strict';
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Title Required'}
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Author Required'}
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: 'Genre Required'}
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        parse: value => {
          if (value.length) {
            const year = parseInt(value);
            if (!year || year > new Date().getFullYear()) {
              throw new Error('Valid Year Required');            
            }
          }
        }
      }
    }
  }, {});
  books.associate = function(models) {
    // associations can be defined here
    books.hasOne(models.loans, {foreignKey: 'book_id'});
  };
  return books;
};
