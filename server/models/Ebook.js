const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ebook = sequelize.define('Ebook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'generating', 'completed', 'failed'),
    defaultValue: 'draft'
  },
  num_chapters: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  words_per_chapter: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  tone: {
    type: DataTypes.STRING,
    defaultValue: 'professional'
  },
  target_audience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English'
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  table_of_contents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  total_words: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  generation_progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  template_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'ebooks',
  timestamps: true
});

module.exports = Ebook;
