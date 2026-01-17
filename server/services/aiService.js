const Groq = require('groq-sdk');
const { Ebook, Chapter, User } = require('../models');
const logger = require('../utils/logger');

// Lazy initialization of Groq client
let groq = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Please add it to your environment variables.');
  }
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
};

// Generate table of contents
exports.generateTableOfContents = async (ebook) => {
  try {
    const numChapters = ebook.num_chapters || 10;
    
    const prompt = `Generate a table of contents for an ebook with EXACTLY ${numChapters} chapters.

Ebook Details:
- Title: ${ebook.title}
- Topic: ${ebook.topic}
- Target Audience: ${ebook.target_audience || 'General readers'}
- Tone: ${ebook.tone}

IMPORTANT: You MUST provide EXACTLY ${numChapters} chapter titles - no more, no less.

Requirements:
- Create exactly ${numChapters} chapter titles
- Titles should form a logical progression from introduction to conclusion
- Cover the topic comprehensively
- Make titles engaging and descriptive
- Return ONLY the chapter titles, one per line, numbered 1 through ${numChapters}

Generate the ${numChapters} chapter titles now:`;

    const chatCompletion = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: `You are an expert ebook planner. When asked for ${numChapters} chapter titles, you provide EXACTLY ${numChapters} titles - never more, never less.`
      }, {
        role: 'user',
        content: prompt
      }]
    });

    const content = chatCompletion.choices[0].message.content;
    let chapters = content.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.?\s*[-:.]?\s*/, '').trim())
      .filter(line => line.length > 0 && !line.toLowerCase().startsWith('chapter'));

    // Ensure we have exactly the requested number of chapters
    if (chapters.length > numChapters) {
      chapters = chapters.slice(0, numChapters);
    } else if (chapters.length < numChapters) {
      // Fill in missing chapters with generic titles
      for (let i = chapters.length; i < numChapters; i++) {
        chapters.push(`${ebook.topic} - Part ${i + 1}`);
      }
    }

    logger.info(`Generated TOC with ${chapters.length} chapters for ebook: ${ebook.title}`);
    return chapters;
  } catch (error) {
    logger.error('Generate TOC error:', error);
    throw new Error(`Failed to generate table of contents: ${error.message}`);
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

    const targetWords = ebook.words_per_chapter || 1000;
    
    // Calculate max_tokens based on target word count (roughly 1.3 tokens per word + buffer)
    // Groq's llama model max is 8192, so cap it there
    const estimatedTokens = Math.min(Math.ceil(targetWords * 1.5) + 500, 8000);

    const prompt = `You are writing Chapter ${chapter.chapter_number} of ${ebook.num_chapters} for an ebook.

CRITICAL REQUIREMENTS:
1. You MUST write EXACTLY ${targetWords} words (minimum ${Math.floor(targetWords * 0.9)} words, maximum ${Math.ceil(targetWords * 1.1)} words)
2. This is chapter ${chapter.chapter_number} of ${ebook.num_chapters} total chapters

Ebook Details:
- Title: ${ebook.title}
- Topic: ${ebook.topic}
- Chapter Title: ${chapter.title}
- Tone: ${ebook.tone}
- Target Audience: ${ebook.target_audience || 'General readers'}

Full Table of Contents (${ebook.num_chapters} chapters):
${chaptersContext}

${chapter.chapter_number === 1 ? 'IMPORTANT: This is the FIRST chapter - include an engaging introduction that hooks the reader and sets the stage for the entire ebook.' : ''}
${chapter.chapter_number === ebook.num_chapters ? 'IMPORTANT: This is the FINAL chapter - provide a strong conclusion that summarizes key points and leaves the reader with actionable takeaways.' : ''}

Writing Guidelines:
- Write EXACTLY around ${targetWords} words - this is very important
- Use a ${ebook.tone} tone throughout
- Include practical examples and clear explanations
- Use subheadings to organize the content (use ## for subheadings)
- Make it engaging, informative, and valuable to the reader
- Ensure smooth transitions and logical flow
- Do NOT include "Chapter X:" at the beginning - just start with the content

BEGIN WRITING THE CHAPTER NOW:`;

    const chatCompletion = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: estimatedTokens,
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: `You are an expert ebook author. You write engaging, well-structured content. You ALWAYS write the exact word count requested - no more, no less. When asked to write ${targetWords} words, you write exactly that amount.`
      }, {
        role: 'user',
        content: prompt
      }]
    });

    let content = chatCompletion.choices[0].message.content;
    
    // Log actual word count for debugging
    const actualWordCount = content.split(/\s+/).length;
    logger.info(`Chapter ${chapter.chapter_number}: Target ${targetWords} words, Generated ${actualWordCount} words`);

    return content;
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

    const chatCompletion = await getGroqClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    logger.error('Improve content error:', error);
    throw new Error('Failed to improve content');
  }
};
