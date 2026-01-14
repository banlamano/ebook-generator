const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/templates
// @desc    Get all templates
// @access  Private
router.get('/', protect, templateController.getTemplates);

// @route   GET /api/templates/:id
// @desc    Get single template
// @access  Private
router.get('/:id', protect, templateController.getTemplate);

// @route   POST /api/templates
// @desc    Create template (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), templateController.createTemplate);

// @route   PUT /api/templates/:id
// @desc    Update template (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), templateController.updateTemplate);

// @route   DELETE /api/templates/:id
// @desc    Delete template (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), templateController.deleteTemplate);

module.exports = router;
