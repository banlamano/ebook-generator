const { Ebook, Chapter, User } = require('../models');
const aiService = require('../services/aiService');
const exportService = require('../services/exportService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// @desc    Get all user ebooks
exports.getEbooks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: req.user.id };
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const { count, rows: ebooks } = await Ebook.findAndCountAll({
      where,
      include: [{
        model: Chapter,
        as: 'chapters',
        attributes: ['id', 'chapter_number', 'title', 'word_count', 'status']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: ebooks,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ebooks'
    });
  }
};

// @desc    Create new ebook
exports.createEbook = async (req, res) => {
  try {
    const {
      title,
      topic,
      description,
      num_chapters,
      words_per_chapter,
      tone,
      target_audience,
      language,
      template_id,
      chapter_titles
    } = req.body;

    // Validate input
    if (!title || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Title and topic are required'
      });
    }

    // Create ebook with chapter_titles stored in metadata if from template
    const metadata = {};
    if (chapter_titles && Array.isArray(chapter_titles) && chapter_titles.length > 0) {
      metadata.chapter_titles = chapter_titles;
    }

    // Create ebook
    const ebook = await Ebook.create({
      user_id: req.user.id,
      title,
      topic,
      description,
      num_chapters: num_chapters || 10,
      words_per_chapter: words_per_chapter || 1000,
      tone: tone || 'professional',
      target_audience,
      language: language || 'English',
      template_id,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      data: ebook,
      message: 'Ebook created successfully'
    });
  } catch (error) {
    logger.error('Create ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ebook'
    });
  }
};

// @desc    Get single ebook
exports.getEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Chapter,
        as: 'chapters',
        order: [['chapter_number', 'ASC']]
      }]
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    res.json({
      success: true,
      data: ebook
    });
  } catch (error) {
    logger.error('Get ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ebook'
    });
  }
};

// @desc    Update ebook
exports.updateEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    const allowedUpdates = [
      'title', 'topic', 'description', 'tone', 
      'target_audience', 'cover_image', 'metadata'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await ebook.update(updates);

    res.json({
      success: true,
      data: ebook,
      message: 'Ebook updated successfully'
    });
  } catch (error) {
    logger.error('Update ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ebook'
    });
  }
};

// @desc    Delete ebook
exports.deleteEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    await ebook.destroy();

    res.json({
      success: true,
      message: 'Ebook deleted successfully'
    });
  } catch (error) {
    logger.error('Delete ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ebook'
    });
  }
};

// @desc    Generate ebook content with AI
exports.generateContent = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    // Update status
    await ebook.update({ status: 'generating' });

    // Check if template chapter titles exist in metadata
    let toc;
    const metadata = ebook.metadata || {};
    
    if (metadata.chapter_titles && Array.isArray(metadata.chapter_titles) && metadata.chapter_titles.length > 0) {
      // Use chapter titles from template
      toc = metadata.chapter_titles;
      logger.info(`Using ${toc.length} chapter titles from template for ebook ${ebook.id}`);
    } else {
      // Generate table of contents with AI
      toc = await aiService.generateTableOfContents(ebook);
    }
    
    await ebook.update({ table_of_contents: toc });

    // Create chapters using the determined number (from template or ebook settings)
    const numChapters = toc.length || ebook.num_chapters;
    for (let i = 0; i < numChapters; i++) {
      await Chapter.create({
        ebook_id: ebook.id,
        chapter_number: i + 1,
        title: toc[i] || `Chapter ${i + 1}`,
        status: 'pending'
      });
    }

    // Start generating chapters in background
    setImmediate(async () => {
      await aiService.generateAllChapters(ebook.id, req.user.id);
    });

    // Deduct credit if not pro/enterprise
    if (req.user.subscription_tier !== 'pro' && req.user.subscription_tier !== 'enterprise') {
      await User.update(
        { credits_remaining: req.user.credits_remaining - 1 },
        { where: { id: req.user.id } }
      );
    }

    res.json({
      success: true,
      message: 'Ebook generation started',
      data: ebook
    });
  } catch (error) {
    logger.error('Generate content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ebook content',
      error: error.message || 'Unknown error'
    });
  }
};

// @desc    Generate single chapter
exports.generateChapter = async (req, res) => {
  try {
    const { chapterId } = req.body;

    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    const chapter = await Chapter.findOne({
      where: {
        id: chapterId,
        ebook_id: ebook.id
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Generate chapter content
    await chapter.update({ status: 'generating' });
    const content = await aiService.generateChapterContent(ebook, chapter);
    
    const wordCount = content.split(/\s+/).length;
    await chapter.update({
      content,
      word_count: wordCount,
      status: 'completed'
    });

    res.json({
      success: true,
      data: chapter,
      message: 'Chapter generated successfully'
    });
  } catch (error) {
    logger.error('Generate chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate chapter'
    });
  }
};

// @desc    Export ebook
exports.exportEbook = async (req, res) => {
  try {
    const { format } = req.body; // pdf, epub, mobi, docx

    const ebook = await Ebook.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Chapter,
        as: 'chapters',
        order: [['chapter_number', 'ASC']]
      }]
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Ebook not found'
      });
    }

    if (ebook.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Ebook generation is not completed yet'
      });
    }

    // Generate export file
    const filePath = await exportService.exportEbook(ebook, format);

    res.json({
      success: true,
      data: {
        downloadUrl: `/uploads/${filePath}`
      },
      message: 'Ebook exported successfully'
    });
  } catch (error) {
    logger.error('Export ebook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export ebook'
    });
  }
};

// @desc    Update chapter
exports.updateChapter = async (req, res) => {
  try {
    const { content, title } = req.body;

    const chapter = await Chapter.findOne({
      where: { id: req.params.chapterId },
      include: [{
        model: Ebook,
        as: 'ebook',
        where: { user_id: req.user.id }
      }]
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    const updates = {};
    if (content !== undefined) {
      updates.content = content;
      updates.word_count = content.split(/\s+/).length;
      updates.status = 'edited';
    }
    if (title !== undefined) {
      updates.title = title;
    }

    await chapter.update(updates);

    res.json({
      success: true,
      data: chapter,
      message: 'Chapter updated successfully'
    });
  } catch (error) {
    logger.error('Update chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chapter'
    });
  }
};
