const { Template } = require('../models');
const logger = require('../utils/logger');

async function seed() {
  try {
    logger.info('Starting database seeding...');

    // Seed templates
    const templates = [
      {
        name: 'Business Marketing Guide',
        category: 'business',
        description: 'Complete guide for digital marketing strategies and tactics',
        structure: {
          chapters: [
            'Introduction to Digital Marketing',
            'Understanding Your Target Audience',
            'Content Marketing Strategies',
            'Social Media Marketing',
            'Email Marketing Campaigns',
            'SEO and SEM Fundamentals',
            'Analytics and Measurement',
            'Future Trends in Marketing'
          ]
        },
        is_premium: false
      },
      {
        name: 'Self-Help & Personal Growth',
        category: 'self-help',
        description: 'Transform your life with proven personal development strategies',
        structure: {
          chapters: [
            'Understanding Yourself',
            'Setting Meaningful Goals',
            'Building Positive Habits',
            'Overcoming Obstacles',
            'Developing Resilience',
            'Improving Relationships',
            'Finding Your Purpose',
            'Creating Lasting Change'
          ]
        },
        is_premium: false
      },
      {
        name: 'Technical How-To Manual',
        category: 'technical',
        description: 'Comprehensive technical guide for any subject matter',
        structure: {
          chapters: [
            'Getting Started',
            'Basic Concepts',
            'Core Features',
            'Advanced Techniques',
            'Best Practices',
            'Troubleshooting',
            'Case Studies',
            'Resources and Next Steps'
          ]
        },
        is_premium: true
      },
      {
        name: 'Fiction Story Structure',
        category: 'fiction',
        description: 'Create compelling fiction with this proven story framework',
        structure: {
          chapters: [
            'The Opening Hook',
            'Introducing Characters',
            'Building the World',
            'Rising Action',
            'Midpoint Twist',
            'Complications',
            'Climax',
            'Resolution'
          ]
        },
        is_premium: true
      },
      {
        name: 'Educational Course Material',
        category: 'education',
        description: 'Structured learning material for any educational topic',
        structure: {
          chapters: [
            'Course Overview',
            'Foundational Concepts',
            'Module 1: Core Principles',
            'Module 2: Practical Application',
            'Module 3: Advanced Topics',
            'Exercises and Activities',
            'Assessment Guide',
            'Continuing Education'
          ]
        },
        is_premium: false
      }
    ];

    for (const template of templates) {
      await Template.findOrCreate({
        where: { name: template.name },
        defaults: template
      });
    }

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
