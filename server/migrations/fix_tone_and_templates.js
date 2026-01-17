/**
 * Migration: Fix tone column and update templates
 * 
 * This migration:
 * 1. Converts the 'tone' ENUM column to VARCHAR for flexibility
 * 2. Updates existing templates with stock images
 * 3. Seeds templates if none exist
 * 
 * Run manually: node server/migrations/fix_tone_and_templates.js
 * Or it runs automatically on server startup
 */

const { sequelize, Template } = require('../models');
const logger = require('../utils/logger');

// Stock images from Unsplash for each category
const categoryImages = {
  business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'self-help': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
  technical: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  fiction: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&h=300&fit=crop',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  memoir: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
  hobby: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
  parenting: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
  spirituality: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
  food: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop',
  pets: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
  lifestyle: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
};

// More specific images for certain template types
const templateImages = {
  'Business Marketing Guide': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  'Startup Launch Playbook': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
  'Leadership & Management': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
  'Self-Help & Personal Growth': 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&h=300&fit=crop',
  'Mindfulness & Meditation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  'Financial Freedom Blueprint': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
  'Programming Language Guide': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop',
  'Web Development Handbook': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
  'API Design & Integration': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
  'Fiction Story Structure': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
  'Mystery & Thriller': 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop',
  'Romance Novel': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
  'Science Fiction Epic': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop',
  'Fantasy Adventure': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
  'Educational Textbook': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
  'Online Course Companion': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
  'Study Guide': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
  'Fitness & Exercise Guide': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
  'Healthy Recipe Cookbook': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
  'Travel Guide': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
  'Personal Memoir': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
  'Gardening Basics': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  'Photography Guide': 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400&h=300&fit=crop',
  'Sales Mastery Guide': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400&h=300&fit=crop',
  'Social Media Marketing': 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
  'Parenting Guide': 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
  'Pregnancy Journey': 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=400&h=300&fit=crop',
  'Spiritual Growth Guide': 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
  'Daily Devotional': 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop',
  'Productivity System': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
  'Real Estate Investment Guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  'Anxiety & Stress Management': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
  'Depression Recovery Workbook': 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=400&h=300&fit=crop',
  'Career Change Blueprint': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  'Remote Work Success': 'https://images.unsplash.com/photo-1521898284481-a5ec348cb555?w=400&h=300&fit=crop',
  "Children's Picture Book": 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  'Young Adult Novel': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
  'International Cuisine Cookbook': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
  'Baking & Pastry Guide': 'https://images.unsplash.com/photo-1486427944544-d2c6128c6cf7?w=400&h=300&fit=crop',
  'Music Theory & Practice': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop',
  'Drawing & Illustration': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
  'Dog Training Guide': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
  'Complete Pet Care': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
  'Home Gardening Guide': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  'E-Commerce Business Guide': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  'Freelancing Success': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'Historical Non-Fiction': 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop',
  'Popular Science Book': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=300&fit=crop',
  'Nature & Wildlife': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  'Video Game Strategy Guide': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
  'Poetry Collection': 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=400&h=300&fit=crop',
  'Wedding Planning Guide': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  'Event Planning Handbook': 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop',
  'Language Learning Guide': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
  'Relationship Improvement': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop'
};

// Helper to get image for a template
const getTemplateImage = (name, category) => {
  return templateImages[name] || categoryImages[category] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop';
};

async function fixToneColumn() {
  const dialect = sequelize.getDialect();
  
  if (dialect === 'postgres') {
    try {
      // Check if the column exists and is an enum
      const [results] = await sequelize.query(`
        SELECT data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_name = 'ebooks' AND column_name = 'tone'
      `);
      
      if (results.length > 0 && results[0].data_type === 'USER-DEFINED') {
        logger.info('Converting tone column from ENUM to VARCHAR...');
        
        // PostgreSQL: Convert ENUM to VARCHAR
        await sequelize.query(`
          ALTER TABLE ebooks 
          ALTER COLUMN tone TYPE VARCHAR(255) 
          USING tone::VARCHAR(255)
        `);
        
        // Drop the old enum type if it exists
        try {
          await sequelize.query(`DROP TYPE IF EXISTS "enum_ebooks_tone"`);
        } catch (e) {
          // Ignore if type doesn't exist
        }
        
        logger.info('✅ Tone column converted to VARCHAR successfully');
        return true;
      } else {
        logger.info('Tone column is already VARCHAR or table does not exist');
        return false;
      }
    } catch (error) {
      if (error.message.includes('does not exist')) {
        logger.info('Ebooks table does not exist yet, will be created on sync');
        return false;
      }
      throw error;
    }
  } else {
    logger.info(`Dialect ${dialect} does not require ENUM migration`);
    return false;
  }
}

async function updateTemplateImages() {
  try {
    const templates = await Template.findAll();
    
    if (templates.length === 0) {
      logger.info('No templates found to update');
      return 0;
    }
    
    let updatedCount = 0;
    
    for (const template of templates) {
      // Check if template needs image update (missing or local path)
      const needsUpdate = !template.preview_image || 
                          template.preview_image.startsWith('/templates/') ||
                          !template.preview_image.includes('http');
      
      if (needsUpdate) {
        const newImage = getTemplateImage(template.name, template.category);
        await template.update({ preview_image: newImage });
        updatedCount++;
        logger.info(`Updated image for: ${template.name}`);
      }
    }
    
    logger.info(`✅ Updated ${updatedCount} template images`);
    return updatedCount;
  } catch (error) {
    logger.error('Failed to update template images:', error.message);
    return 0;
  }
}

async function runMigration() {
  try {
    logger.info('=== Starting Database Migration ===');
    
    // Step 1: Fix tone column for PostgreSQL (before sync)
    await fixToneColumn();
    
    // Step 2: Sync database (creates tables if they don't exist - no alter to avoid FK issues)
    await sequelize.sync({ force: false });
    logger.info('✅ Database schema synchronized');
    
    // Step 3: Seed templates if needed
    const { seedTemplates } = require('./seed');
    const seedResult = await seedTemplates();
    if (seedResult.seeded) {
      logger.info(`✅ Seeded ${seedResult.count} new templates`);
    } else {
      logger.info(`Templates already exist: ${seedResult.count}`);
    }
    
    // Step 4: Update existing template images
    const updatedImages = await updateTemplateImages();
    
    logger.info('=== Migration Complete ===');
    
    return {
      success: true,
      toneFixed: true,
      templatesSeeded: seedResult.seeded,
      templateCount: seedResult.count,
      imagesUpdated: updatedImages
    };
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

// Export for use in server startup
module.exports = { runMigration, fixToneColumn, updateTemplateImages, getTemplateImage };

// Run directly if called as a script
if (require.main === module) {
  runMigration()
    .then((result) => {
      console.log('\n✅ Migration completed successfully!');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    });
}
