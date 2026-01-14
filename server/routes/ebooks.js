const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const { protect, checkCredits } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/ebooks
// @desc    Get all user ebooks
// @access  Private
router.get('/', ebookController.getEbooks);

// @route   POST /api/ebooks
// @desc    Create new ebook
// @access  Private
router.post('/', checkCredits, ebookController.createEbook);

// @route   GET /api/ebooks/:id
// @desc    Get single ebook
// @access  Private
router.get('/:id', ebookController.getEbook);

// @route   PUT /api/ebooks/:id
// @desc    Update ebook
// @access  Private
router.put('/:id', ebookController.updateEbook);

// @route   DELETE /api/ebooks/:id
// @desc    Delete ebook
// @access  Private
router.delete('/:id', ebookController.deleteEbook);

// @route   POST /api/ebooks/:id/generate
// @desc    Generate ebook content with AI
// @access  Private
router.post('/:id/generate', ebookController.generateContent);

// @route   POST /api/ebooks/:id/generate-chapter
// @desc    Generate single chapter content
// @access  Private
router.post('/:id/generate-chapter', ebookController.generateChapter);

// @route   POST /api/ebooks/:id/export
// @desc    Export ebook in specified format
// @access  Private
router.post('/:id/export', ebookController.exportEbook);

// @route   PUT /api/ebooks/:id/chapters/:chapterId
// @desc    Update chapter content
// @access  Private
router.put('/:id/chapters/:chapterId', ebookController.updateChapter);

module.exports = router;
