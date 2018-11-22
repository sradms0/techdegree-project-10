'use strict';
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {});
  books.associate = function(models) {
    // associations can be defined here
    books.hasOne(models.loans, {foreignKey: 'book_id'});
  };
  return books;
};
