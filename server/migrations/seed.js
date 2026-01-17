const { Template } = require('../models');
const logger = require('../utils/logger');

// Template data for seeding
const templateData = [
      // ============ BUSINESS TEMPLATES ============
      {
        name: 'Business Marketing Guide',
        category: 'business',
        description: 'Complete guide for digital marketing strategies and tactics. Perfect for entrepreneurs and marketing professionals.',
        preview_image: '/templates/business-marketing.png',
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
          ],
          tone: 'professional',
          words_per_chapter: 2000
        },
        is_premium: false
      },
      {
        name: 'Startup Launch Playbook',
        category: 'business',
        description: 'Step-by-step guide to launching your startup from idea to market. Includes funding strategies and growth hacks.',
        preview_image: '/templates/startup-playbook.png',
        structure: {
          chapters: [
            'Validating Your Business Idea',
            'Market Research & Competitive Analysis',
            'Building Your MVP',
            'Funding Options & Pitch Deck Creation',
            'Legal & Financial Setup',
            'Building Your Team',
            'Go-to-Market Strategy',
            'Scaling Your Business',
            'Common Pitfalls to Avoid',
            'Success Stories & Lessons Learned'
          ],
          tone: 'professional',
          words_per_chapter: 2500
        },
        is_premium: true
      },
      {
        name: 'Leadership & Management',
        category: 'business',
        description: 'Essential leadership skills and management techniques for modern executives and team leaders.',
        preview_image: '/templates/leadership.png',
        structure: {
          chapters: [
            'The Foundations of Leadership',
            'Developing Your Leadership Style',
            'Building High-Performance Teams',
            'Effective Communication Strategies',
            'Decision Making Under Pressure',
            'Conflict Resolution & Negotiation',
            'Driving Innovation & Change',
            'Measuring & Improving Performance'
          ],
          tone: 'professional',
          words_per_chapter: 2000
        },
        is_premium: false
      },

      // ============ SELF-HELP TEMPLATES ============
      {
        name: 'Self-Help & Personal Growth',
        category: 'self-help',
        description: 'Transform your life with proven personal development strategies. A comprehensive guide to becoming your best self.',
        preview_image: '/templates/personal-growth.png',
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
          ],
          tone: 'conversational',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Mindfulness & Meditation',
        category: 'self-help',
        description: 'A practical guide to mindfulness, meditation, and achieving inner peace in a busy world.',
        preview_image: '/templates/mindfulness.png',
        structure: {
          chapters: [
            'Introduction to Mindfulness',
            'The Science of Meditation',
            'Starting Your Practice',
            'Breathing Techniques',
            'Body Scan Meditation',
            'Mindful Living Daily',
            'Dealing with Stress & Anxiety',
            'Advanced Meditation Practices',
            'Building a Sustainable Practice'
          ],
          tone: 'calm',
          words_per_chapter: 1500
        },
        is_premium: false
      },
      {
        name: 'Financial Freedom Blueprint',
        category: 'self-help',
        description: 'Master your finances and build wealth with practical money management strategies.',
        preview_image: '/templates/financial-freedom.png',
        structure: {
          chapters: [
            'Understanding Your Financial Situation',
            'Creating a Budget That Works',
            'Eliminating Debt Strategically',
            'Building an Emergency Fund',
            'Introduction to Investing',
            'Retirement Planning Essentials',
            'Multiple Income Streams',
            'Tax Optimization Strategies',
            'Protecting Your Wealth',
            'Living Your Financial Freedom'
          ],
          tone: 'professional',
          words_per_chapter: 2000
        },
        is_premium: true
      },

      // ============ TECHNICAL TEMPLATES ============
      {
        name: 'Technical How-To Manual',
        category: 'technical',
        description: 'Comprehensive technical guide for any subject matter. Perfect for software, engineering, or scientific topics.',
        preview_image: '/templates/technical-manual.png',
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
          ],
          tone: 'technical',
          words_per_chapter: 2500
        },
        is_premium: true
      },
      {
        name: 'Programming Language Guide',
        category: 'technical',
        description: 'Complete programming tutorial from basics to advanced concepts. Ideal for any programming language.',
        preview_image: '/templates/programming.png',
        structure: {
          chapters: [
            'Introduction & Setup',
            'Syntax and Basic Concepts',
            'Variables and Data Types',
            'Control Flow & Loops',
            'Functions and Methods',
            'Object-Oriented Programming',
            'Error Handling & Debugging',
            'Working with Files & APIs',
            'Testing and Best Practices',
            'Building Real-World Projects'
          ],
          tone: 'technical',
          words_per_chapter: 2200
        },
        is_premium: true
      },
      {
        name: 'API Documentation Template',
        category: 'technical',
        description: 'Professional API documentation structure for developers. Clear, concise, and developer-friendly.',
        preview_image: '/templates/api-docs.png',
        structure: {
          chapters: [
            'API Overview',
            'Authentication & Authorization',
            'Getting Started Guide',
            'Core Endpoints',
            'Request & Response Formats',
            'Error Handling',
            'Rate Limiting & Best Practices',
            'Code Examples & SDKs',
            'Changelog & Versioning'
          ],
          tone: 'technical',
          words_per_chapter: 1500
        },
        is_premium: false
      },

      // ============ FICTION TEMPLATES ============
      {
        name: 'Fiction Story Structure',
        category: 'fiction',
        description: 'Create compelling fiction with this proven story framework. Perfect for novels and novellas.',
        preview_image: '/templates/fiction-story.png',
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
          ],
          tone: 'creative',
          words_per_chapter: 3000
        },
        is_premium: true
      },
      {
        name: 'Mystery & Thriller',
        category: 'fiction',
        description: 'Craft suspenseful mysteries and thrillers that keep readers on the edge of their seats.',
        preview_image: '/templates/mystery.png',
        structure: {
          chapters: [
            'The Crime / Inciting Incident',
            'Introducing the Detective',
            'First Clues & Red Herrings',
            'Deepening the Mystery',
            'Plot Twist',
            'Racing Against Time',
            'The Revelation',
            'Confrontation',
            'Resolution & Aftermath'
          ],
          tone: 'suspenseful',
          words_per_chapter: 3500
        },
        is_premium: true
      },
      {
        name: 'Romance Novel',
        category: 'fiction',
        description: 'Write heartwarming romance stories with this proven romantic arc structure.',
        preview_image: '/templates/romance.png',
        structure: {
          chapters: [
            'Meet the Protagonist',
            'The Meet-Cute',
            'Getting to Know Each Other',
            'Growing Attraction',
            'First Kiss / Major Moment',
            'Obstacles & Conflicts',
            'The Dark Moment',
            'Grand Gesture',
            'Happily Ever After'
          ],
          tone: 'romantic',
          words_per_chapter: 3000
        },
        is_premium: false
      },

      // ============ EDUCATION TEMPLATES ============
      {
        name: 'Educational Course Material',
        category: 'education',
        description: 'Structured learning material for any educational topic. Includes exercises and assessments.',
        preview_image: '/templates/course-material.png',
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
          ],
          tone: 'educational',
          words_per_chapter: 2000
        },
        is_premium: false
      },
      {
        name: 'Children\'s Educational Book',
        category: 'education',
        description: 'Create engaging educational content for children with age-appropriate language and concepts.',
        preview_image: '/templates/kids-education.png',
        structure: {
          chapters: [
            'Welcome & Introduction',
            'Fun Facts to Know',
            'Let\'s Explore Together',
            'Hands-On Activities',
            'Story Time',
            'Quiz & Games',
            'What We Learned',
            'Keep Exploring!'
          ],
          tone: 'friendly',
          words_per_chapter: 800
        },
        is_premium: false
      },
      {
        name: 'Academic Research Guide',
        category: 'education',
        description: 'Comprehensive academic writing template for research papers, theses, and dissertations.',
        preview_image: '/templates/academic.png',
        structure: {
          chapters: [
            'Abstract & Introduction',
            'Literature Review',
            'Research Methodology',
            'Data Collection',
            'Analysis & Findings',
            'Discussion',
            'Conclusions & Recommendations',
            'References & Appendices'
          ],
          tone: 'academic',
          words_per_chapter: 3000
        },
        is_premium: true
      },

      // ============ HEALTH & WELLNESS TEMPLATES ============
      {
        name: 'Fitness & Exercise Guide',
        category: 'health',
        description: 'Complete fitness program guide with workout plans, nutrition tips, and motivation strategies.',
        preview_image: '/templates/fitness.png',
        structure: {
          chapters: [
            'Setting Your Fitness Goals',
            'Understanding Your Body',
            'Nutrition Fundamentals',
            'Cardiovascular Training',
            'Strength Training Basics',
            'Flexibility & Recovery',
            'Creating Your Workout Plan',
            'Staying Motivated',
            'Tracking Progress',
            'Advanced Techniques'
          ],
          tone: 'motivational',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Healthy Recipe Cookbook',
        category: 'health',
        description: 'Organize delicious and healthy recipes with this cookbook template. Includes meal planning tips.',
        preview_image: '/templates/cookbook.png',
        structure: {
          chapters: [
            'Introduction to Healthy Eating',
            'Kitchen Essentials & Tips',
            'Breakfast Recipes',
            'Lunch Ideas',
            'Dinner Favorites',
            'Healthy Snacks',
            'Desserts & Treats',
            'Meal Prep Guide',
            'Special Diets & Substitutions'
          ],
          tone: 'friendly',
          words_per_chapter: 1500
        },
        is_premium: false
      },

      // ============ TRAVEL TEMPLATES ============
      {
        name: 'Travel Guide',
        category: 'travel',
        description: 'Create comprehensive travel guides for any destination with insider tips and recommendations.',
        preview_image: '/templates/travel-guide.png',
        structure: {
          chapters: [
            'Destination Overview',
            'Planning Your Trip',
            'Getting There & Around',
            'Where to Stay',
            'Must-See Attractions',
            'Hidden Gems',
            'Food & Dining',
            'Shopping & Entertainment',
            'Practical Tips & Safety',
            'Sample Itineraries'
          ],
          tone: 'enthusiastic',
          words_per_chapter: 2000
        },
        is_premium: false
      },

      // ============ MEMOIR & BIOGRAPHY TEMPLATES ============
      {
        name: 'Memoir & Life Story',
        category: 'memoir',
        description: 'Tell your life story or write a biography with this emotionally engaging memoir template.',
        preview_image: '/templates/memoir.png',
        structure: {
          chapters: [
            'Early Beginnings',
            'Childhood Memories',
            'Coming of Age',
            'Defining Moments',
            'Challenges & Struggles',
            'Turning Points',
            'Achievements & Milestones',
            'Relationships That Shaped Me',
            'Lessons Learned',
            'Looking Forward'
          ],
          tone: 'reflective',
          words_per_chapter: 2500
        },
        is_premium: true
      },

      // ============ HOBBY & DIY TEMPLATES ============
      {
        name: 'DIY & Craft Guide',
        category: 'hobby',
        description: 'Step-by-step crafting and DIY project guide with materials lists and instructions.',
        preview_image: '/templates/diy-craft.png',
        structure: {
          chapters: [
            'Introduction to the Craft',
            'Tools & Materials',
            'Basic Techniques',
            'Beginner Projects',
            'Intermediate Projects',
            'Advanced Projects',
            'Troubleshooting Common Issues',
            'Tips from the Experts',
            'Resources & Inspiration'
          ],
          tone: 'instructional',
          words_per_chapter: 1500
        },
        is_premium: false
      },
      {
        name: 'Photography Guide',
        category: 'hobby',
        description: 'Master photography from basics to advanced techniques with this comprehensive guide.',
        preview_image: '/templates/photography.png',
        structure: {
          chapters: [
            'Understanding Your Camera',
            'Composition Fundamentals',
            'Lighting Techniques',
            'Portrait Photography',
            'Landscape Photography',
            'Action & Sports Photography',
            'Post-Processing & Editing',
            'Building Your Portfolio',
            'Going Professional'
          ],
          tone: 'instructional',
          words_per_chapter: 2000
        },
        is_premium: true
      }
];

// Function to seed templates (can be called from server startup)
async function seedTemplates() {
  try {
    // Check if templates already exist
    const existingCount = await Template.count();
    if (existingCount > 0) {
      logger.info(`Templates already exist (${existingCount} found). Skipping seed.`);
      return { seeded: false, count: existingCount };
    }

    logger.info('No templates found. Seeding database with professional templates...');

    for (const template of templateData) {
      await Template.findOrCreate({
        where: { name: template.name },
        defaults: template
      });
    }

    const newCount = await Template.count();
    logger.info(`Database seeding completed successfully. ${newCount} templates created.`);
    return { seeded: true, count: newCount };
  } catch (error) {
    logger.error('Seeding failed:', error);
    throw error;
  }
}

// Export for use in server startup
module.exports = { seedTemplates, templateData };

// Run directly if called as a script
if (require.main === module) {
  seedTemplates()
    .then((result) => {
      console.log('Seed result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed error:', error);
      process.exit(1);
    });
}
