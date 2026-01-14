const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Export ebook to PDF
exports.exportToPDF = async (ebook) => {
  try {
    const filename = `${uuidv4()}.pdf`;
    const filepath = path.join(uploadsDir, filename);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Cover page
      doc.fontSize(32).text(ebook.title, { align: 'center' });
      doc.moveDown();
      if (ebook.description) {
        doc.fontSize(14).text(ebook.description, { align: 'center' });
      }
      doc.addPage();

      // Table of contents
      doc.fontSize(24).text('Table of Contents', { underline: true });
      doc.moveDown();
      
      ebook.chapters.forEach((chapter, index) => {
        doc.fontSize(12).text(`${chapter.chapter_number}. ${chapter.title}`, {
          link: `#chapter${chapter.chapter_number}`
        });
        doc.moveDown(0.5);
      });
      doc.addPage();

      // Chapters
      ebook.chapters.forEach(chapter => {
        doc.fontSize(20).text(chapter.title, { 
          underline: true,
          id: `chapter${chapter.chapter_number}`
        });
        doc.moveDown();
        doc.fontSize(12).text(chapter.content || '', {
          align: 'justify',
          lineGap: 2
        });
        doc.addPage();
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', reject);
    });
  } catch (error) {
    logger.error('PDF export error:', error);
    throw error;
  }
};

// Export ebook to DOCX
exports.exportToDOCX = async (ebook) => {
  try {
    const filename = `${uuidv4()}.docx`;
    const filepath = path.join(uploadsDir, filename);

    const sections = [];

    // Title page
    sections.push(
      new Paragraph({
        text: ebook.title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      })
    );

    if (ebook.description) {
      sections.push(
        new Paragraph({
          text: ebook.description,
          spacing: { after: 400 }
        })
      );
    }

    // Table of contents
    sections.push(
      new Paragraph({
        text: 'Table of Contents',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    ebook.chapters.forEach(chapter => {
      sections.push(
        new Paragraph({
          text: `${chapter.chapter_number}. ${chapter.title}`,
          spacing: { after: 100 }
        })
      );
    });

    // Chapters
    ebook.chapters.forEach(chapter => {
      sections.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const content = chapter.content || '';
      const paragraphs = content.split('\n\n');
      
      paragraphs.forEach(para => {
        if (para.trim()) {
          sections.push(
            new Paragraph({
              text: para.trim(),
              spacing: { after: 200 }
            })
          );
        }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filepath, buffer);

    return filename;
  } catch (error) {
    logger.error('DOCX export error:', error);
    throw error;
  }
};

// Export ebook to EPUB
exports.exportToEPUB = async (ebook) => {
  try {
    const Epub = require('epub-gen');
    const filename = `${uuidv4()}.epub`;
    const filepath = path.join(uploadsDir, filename);

    const chapters = ebook.chapters.map(chapter => ({
      title: chapter.title,
      data: `<h1>${chapter.title}</h1>${chapter.content ? chapter.content.split('\n\n').map(p => `<p>${p}</p>`).join('') : ''}`
    }));

    const options = {
      title: ebook.title,
      author: 'AI Ebook Generator',
      publisher: 'AI Ebook Generator',
      description: ebook.description || '',
      content: chapters,
      output: filepath
    };

    await new Epub(options, filepath).promise;
    return filename;
  } catch (error) {
    logger.error('EPUB export error:', error);
    throw error;
  }
};

// Export ebook to MOBI (simplified - converts to EPUB first)
exports.exportToMOBI = async (ebook) => {
  try {
    // For MOBI, we'll export as EPUB (MOBI requires additional tools like Calibre)
    // In production, you'd use calibre's ebook-convert or a similar tool
    const epubFilename = await this.exportToEPUB(ebook);
    
    // Rename to .mobi for now (in production, convert EPUB to MOBI)
    const mobiFilename = epubFilename.replace('.epub', '.mobi');
    const epubPath = path.join(uploadsDir, epubFilename);
    const mobiPath = path.join(uploadsDir, mobiFilename);
    
    fs.copyFileSync(epubPath, mobiPath);
    fs.unlinkSync(epubPath);
    
    return mobiFilename;
  } catch (error) {
    logger.error('MOBI export error:', error);
    throw error;
  }
};

// Main export function
exports.exportEbook = async (ebook, format) => {
  try {
    switch (format.toLowerCase()) {
      case 'pdf':
        return await this.exportToPDF(ebook);
      case 'docx':
        return await this.exportToDOCX(ebook);
      case 'epub':
        return await this.exportToEPUB(ebook);
      case 'mobi':
        return await this.exportToMOBI(ebook);
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    logger.error('Export error:', error);
    throw error;
  }
};
