const { Template } = require('../models');
const logger = require('../utils/logger');

// @desc    Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }

    // Filter premium templates based on subscription
    if (req.user.subscription_tier === 'free') {
      where.is_premium = false;
    }

    const templates = await Template.findAll({
      where,
      order: [['usage_count', 'DESC']]
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    logger.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
};

// @desc    Get single template
exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user has access to premium template
    if (template.is_premium && req.user.subscription_tier === 'free') {
      return res.status(403).json({
        success: false,
        message: 'Upgrade to access premium templates'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    logger.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template'
    });
  }
};

// @desc    Create template
exports.createTemplate = async (req, res) => {
  try {
    const { name, category, description, structure, is_premium, preview_image } = req.body;

    const template = await Template.create({
      name,
      category,
      description,
      structure,
      is_premium: is_premium || false,
      preview_image
    });

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error) {
    logger.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template'
    });
  }
};

// @desc    Update template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.update(req.body);

    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error) {
    logger.error('Update template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template'
    });
  }
};

// @desc    Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.destroy();

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    logger.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template'
    });
  }
};
