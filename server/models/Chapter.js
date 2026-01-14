const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chapter = sequelize.define('Chapter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ebook_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ebooks',
      key: 'id'
    }
  },
  chapter_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  word_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'generating', 'completed', 'edited'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'chapters',
  timestamps: true
});

module.exports = Chapter;
