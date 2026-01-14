const Anthropic = require('@anthropic-ai/sdk');
const { Ebook, Chapter, User } = require('../models');
const logger = require('../utils/logger');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Generate table of contents
exports.generateTableOfContents = async (ebook) => {
  try {
    const prompt = `Generate a table of contents for an ebook with the following details:

Title: ${ebook.title}
Topic: ${ebook.topic}
Number of Chapters: ${ebook.num_chapters}
Target Audience: ${ebook.target_audience || 'General readers'}
Tone: ${ebook.tone}

Please provide ${ebook.num_chapters} chapter titles that form a logical progression and comprehensive coverage of the topic. Return only the chapter titles as a numbered list, one per line.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;
    const chapters = content.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, ebook.num_chapters);

    return chapters;
  } catch (error) {
    logger.error('Generate TOC error:', error);
    throw new Error('Failed to generate table of contents');
  }
};

// Generate chapter content
exports.generateChapterContent = async (ebook, chapter) => {
  try {
    const allChapters = await Chapter.findAll({
      where: { ebook_id: ebook.id },
      order: [['chapter_number', 'ASC']]
    });

    const chaptersContext = allChapters
      .map(ch => `${ch.chapter_number}. ${ch.title}`)
      .join('\n');

    const prompt = `Write Chapter ${chapter.chapter_number} of an ebook with the following specifications:

Ebook Title: ${ebook.title}
Topic: ${ebook.topic}
Chapter Title: ${chapter.title}
Target Word Count: ${ebook.words_per_chapter} words
Tone: ${ebook.tone}
Target Audience: ${ebook.target_audience || 'General readers'}

Full Table of Contents:
${chaptersContext}

${chapter.chapter_number === 1 ? 'This is the first chapter, so include an engaging introduction that sets the stage for the entire ebook.' : ''}
${chapter.chapter_number === ebook.num_chapters ? 'This is the final chapter, so provide a strong conclusion that ties everything together.' : ''}

Requirements:
- Write approximately ${ebook.words_per_chapter} words
- Use a ${ebook.tone} tone throughout
- Include relevant examples and explanations
- Structure with clear subheadings
- Make it engaging and informative
- Ensure it flows logically with the other chapters

Write the complete chapter content now:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    logger.error('Generate chapter content error:', error);
    throw new Error('Failed to generate chapter content');
  }
};

// Generate all chapters
exports.generateAllChapters = async (ebookId, userId) => {
  try {
    const ebook = await Ebook.findByPk(ebookId, {
      include: [{
        model: Chapter,
        as: 'chapters',
        order: [['chapter_number', 'ASC']]
      }]
    });

    if (!ebook) {
      throw new Error('Ebook not found');
    }

    let totalWords = 0;

    for (const chapter of ebook.chapters) {
      try {
        await chapter.update({ status: 'generating' });

        const content = await this.generateChapterContent(ebook, chapter);
        const wordCount = content.split(/\s+/).length;
        totalWords += wordCount;

        await chapter.update({
          content,
          word_count: wordCount,
          status: 'completed'
        });

        // Update progress
        const progress = Math.round((chapter.chapter_number / ebook.num_chapters) * 100);
        await ebook.update({
          generation_progress: progress,
          total_words: totalWords
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (chapterError) {
        logger.error(`Error generating chapter ${chapter.chapter_number}:`, chapterError);
        await chapter.update({ status: 'failed' });
      }
    }

    // Mark ebook as completed
    await ebook.update({
      status: 'completed',
      generation_progress: 100,
      total_words: totalWords
    });

    logger.info(`Ebook ${ebookId} generation completed with ${totalWords} total words`);
  } catch (error) {
    logger.error('Generate all chapters error:', error);
    
    // Mark ebook as failed
    await Ebook.update(
      { status: 'failed' },
      { where: { id: ebookId } }
    );
  }
};

// Improve content (AI-assisted editing)
exports.improveContent = async (content, instruction) => {
  try {
    const prompt = `Please improve the following content based on this instruction: ${instruction}

Original content:
${content}

Provide the improved version:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    logger.error('Improve content error:', error);
    throw new Error('Failed to improve content');
  }
};
