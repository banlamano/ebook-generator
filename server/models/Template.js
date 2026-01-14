const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preview_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  structure: {
    type: DataTypes.JSON,
    allowNull: false
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'templates',
  timestamps: true
});

module.exports = Template;
