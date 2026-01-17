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
      },

      // ============ SCIENCE FICTION TEMPLATES ============
      {
        name: 'Science Fiction Epic',
        category: 'fiction',
        description: 'Create immersive sci-fi worlds with advanced technology, space exploration, and futuristic societies.',
        preview_image: '/templates/scifi.png',
        structure: {
          chapters: [
            'The World of Tomorrow',
            'Introducing the Hero',
            'The Discovery',
            'Into the Unknown',
            'Alien Encounters',
            'The Conflict Escalates',
            'Technology vs Humanity',
            'The Final Battle',
            'A New Beginning'
          ],
          tone: 'imaginative',
          words_per_chapter: 3500
        },
        is_premium: true
      },
      {
        name: 'Fantasy Adventure',
        category: 'fiction',
        description: 'Craft magical worlds with epic quests, mythical creatures, and heroic journeys.',
        preview_image: '/templates/fantasy.png',
        structure: {
          chapters: [
            'The Ordinary World',
            'The Call to Adventure',
            'Meeting the Mentor',
            'Crossing the Threshold',
            'Tests and Allies',
            'The Dark Cave',
            'The Supreme Ordeal',
            'Seizing the Sword',
            'The Road Back',
            'Return with the Elixir'
          ],
          tone: 'epic',
          words_per_chapter: 3000
        },
        is_premium: false
      },

      // ============ MARKETING & SALES TEMPLATES ============
      {
        name: 'Sales Mastery Guide',
        category: 'business',
        description: 'Complete sales training from prospecting to closing deals. Perfect for sales teams and entrepreneurs.',
        preview_image: '/templates/sales.png',
        structure: {
          chapters: [
            'The Psychology of Selling',
            'Prospecting Strategies',
            'Qualifying Leads',
            'Building Rapport',
            'Presenting Solutions',
            'Handling Objections',
            'Closing Techniques',
            'Follow-Up Systems',
            'Account Management',
            'Sales Metrics & KPIs'
          ],
          tone: 'professional',
          words_per_chapter: 2200
        },
        is_premium: true
      },
      {
        name: 'Social Media Marketing',
        category: 'business',
        description: 'Master social media platforms to grow your brand and engage your audience effectively.',
        preview_image: '/templates/social-media.png',
        structure: {
          chapters: [
            'Social Media Landscape',
            'Defining Your Brand Voice',
            'Content Strategy',
            'Instagram Marketing',
            'Facebook & LinkedIn',
            'Twitter & TikTok',
            'Video Content Creation',
            'Community Management',
            'Paid Advertising',
            'Analytics & Optimization'
          ],
          tone: 'engaging',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ PARENTING & FAMILY TEMPLATES ============
      {
        name: 'Parenting Guide',
        category: 'parenting',
        description: 'Comprehensive parenting advice from newborns to teenagers. Evidence-based strategies for raising happy children.',
        preview_image: '/templates/parenting.png',
        structure: {
          chapters: [
            'Understanding Child Development',
            'Building Strong Bonds',
            'Effective Communication',
            'Positive Discipline',
            'Managing Behavior',
            'Supporting Education',
            'Emotional Intelligence',
            'Screen Time & Technology',
            'Family Traditions & Values',
            'Self-Care for Parents'
          ],
          tone: 'supportive',
          words_per_chapter: 2000
        },
        is_premium: false
      },
      {
        name: 'Pregnancy Journey',
        category: 'parenting',
        description: 'Week-by-week pregnancy guide covering health, development, and preparation for baby.',
        preview_image: '/templates/pregnancy.png',
        structure: {
          chapters: [
            'Congratulations! First Trimester',
            'Your Changing Body',
            'Prenatal Care Essentials',
            'Nutrition & Exercise',
            'Second Trimester Joy',
            'Preparing the Nursery',
            'Third Trimester Countdown',
            'Birth Plan & Options',
            'Labor & Delivery',
            'Welcoming Your Baby'
          ],
          tone: 'warm',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ SPIRITUALITY & RELIGION TEMPLATES ============
      {
        name: 'Spiritual Growth Guide',
        category: 'spirituality',
        description: 'Explore your spiritual journey with practices, reflections, and wisdom from various traditions.',
        preview_image: '/templates/spiritual.png',
        structure: {
          chapters: [
            'Beginning Your Spiritual Journey',
            'Understanding Your Beliefs',
            'Prayer & Meditation Practices',
            'Sacred Texts & Wisdom',
            'Living with Purpose',
            'Forgiveness & Healing',
            'Service & Compassion',
            'Spiritual Community',
            'Overcoming Doubt',
            'Deepening Your Practice'
          ],
          tone: 'reflective',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Daily Devotional',
        category: 'spirituality',
        description: 'Create a 30-day devotional with daily readings, reflections, and prayers.',
        preview_image: '/templates/devotional.png',
        structure: {
          chapters: [
            'Week 1: Faith Foundations',
            'Week 1: Daily Readings',
            'Week 2: Love & Relationships',
            'Week 2: Daily Readings',
            'Week 3: Purpose & Calling',
            'Week 3: Daily Readings',
            'Week 4: Hope & Perseverance',
            'Week 4: Daily Readings',
            'Closing Reflections',
            'Continuing Your Journey'
          ],
          tone: 'inspirational',
          words_per_chapter: 1500
        },
        is_premium: true
      },

      // ============ PRODUCTIVITY & TIME MANAGEMENT ============
      {
        name: 'Productivity System',
        category: 'self-help',
        description: 'Build a personal productivity system that works. Time management, focus, and getting things done.',
        preview_image: '/templates/productivity.png',
        structure: {
          chapters: [
            'Why Productivity Matters',
            'Auditing Your Time',
            'Goal Setting Framework',
            'Prioritization Methods',
            'Time Blocking Mastery',
            'Eliminating Distractions',
            'Building Habits',
            'Energy Management',
            'Tools & Systems',
            'Maintaining Momentum'
          ],
          tone: 'actionable',
          words_per_chapter: 2000
        },
        is_premium: false
      },

      // ============ REAL ESTATE TEMPLATES ============
      {
        name: 'Real Estate Investment Guide',
        category: 'business',
        description: 'Complete guide to real estate investing from beginners to advanced strategies.',
        preview_image: '/templates/real-estate.png',
        structure: {
          chapters: [
            'Introduction to Real Estate Investing',
            'Types of Investment Properties',
            'Market Analysis',
            'Financing Options',
            'Finding Great Deals',
            'Due Diligence Process',
            'Property Management',
            'Tax Strategies',
            'Scaling Your Portfolio',
            'Exit Strategies'
          ],
          tone: 'professional',
          words_per_chapter: 2500
        },
        is_premium: true
      },

      // ============ MENTAL HEALTH TEMPLATES ============
      {
        name: 'Anxiety & Stress Management',
        category: 'health',
        description: 'Evidence-based strategies for managing anxiety and stress in daily life.',
        preview_image: '/templates/anxiety.png',
        structure: {
          chapters: [
            'Understanding Anxiety',
            'Identifying Triggers',
            'Breathing Techniques',
            'Cognitive Restructuring',
            'Grounding Exercises',
            'Lifestyle Changes',
            'Building Resilience',
            'When to Seek Help',
            'Supporting Others',
            'Long-term Strategies'
          ],
          tone: 'compassionate',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Depression Recovery Workbook',
        category: 'health',
        description: 'A supportive guide through depression with practical exercises and hope for recovery.',
        preview_image: '/templates/depression.png',
        structure: {
          chapters: [
            'Understanding Depression',
            'You Are Not Alone',
            'Daily Self-Care',
            'Challenging Negative Thoughts',
            'Behavioral Activation',
            'Building Support Networks',
            'Physical Health & Depression',
            'Finding Meaning',
            'Relapse Prevention',
            'Thriving Beyond Depression'
          ],
          tone: 'supportive',
          words_per_chapter: 1600
        },
        is_premium: true
      },

      // ============ CAREER & PROFESSIONAL DEVELOPMENT ============
      {
        name: 'Career Change Blueprint',
        category: 'business',
        description: 'Navigate career transitions successfully with this step-by-step guide.',
        preview_image: '/templates/career-change.png',
        structure: {
          chapters: [
            'Assessing Your Current Situation',
            'Discovering Your Strengths',
            'Exploring New Paths',
            'Skills Gap Analysis',
            'Building Your Brand',
            'Networking Strategies',
            'Resume & LinkedIn Makeover',
            'Interview Preparation',
            'Negotiating Offers',
            'First 90 Days Success'
          ],
          tone: 'encouraging',
          words_per_chapter: 2000
        },
        is_premium: false
      },
      {
        name: 'Remote Work Success',
        category: 'business',
        description: 'Thrive while working from home with productivity tips, communication strategies, and work-life balance.',
        preview_image: '/templates/remote-work.png',
        structure: {
          chapters: [
            'Setting Up Your Home Office',
            'Daily Routines That Work',
            'Communication Best Practices',
            'Video Meeting Mastery',
            'Staying Productive',
            'Collaboration Tools',
            'Managing Up Remotely',
            'Work-Life Boundaries',
            'Staying Connected',
            'Career Growth Remote'
          ],
          tone: 'practical',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ CHILDREN'S STORY TEMPLATES ============
      {
        name: 'Children\'s Picture Book',
        category: 'fiction',
        description: 'Create delightful picture book stories for young readers with engaging narratives.',
        preview_image: '/templates/picture-book.png',
        structure: {
          chapters: [
            'Once Upon a Time',
            'Meet Our Hero',
            'The Adventure Begins',
            'A Problem Appears',
            'Trying to Solve It',
            'Help from Friends',
            'The Big Moment',
            'Happy Ending'
          ],
          tone: 'playful',
          words_per_chapter: 300
        },
        is_premium: false
      },
      {
        name: 'Young Adult Novel',
        category: 'fiction',
        description: 'Craft compelling YA fiction with relatable characters and coming-of-age themes.',
        preview_image: '/templates/young-adult.png',
        structure: {
          chapters: [
            'Life as I Know It',
            'Everything Changes',
            'New Challenges',
            'Finding My People',
            'First Love',
            'Betrayal & Secrets',
            'Standing Up',
            'The Crisis',
            'Who I Really Am',
            'A New Chapter'
          ],
          tone: 'authentic',
          words_per_chapter: 3000
        },
        is_premium: true
      },

      // ============ COOKING & FOOD TEMPLATES ============
      {
        name: 'International Cuisine Cookbook',
        category: 'food',
        description: 'Explore cuisines from around the world with authentic recipes and cultural context.',
        preview_image: '/templates/international-food.png',
        structure: {
          chapters: [
            'Introduction to World Cuisines',
            'Italian Classics',
            'Asian Flavors',
            'Mexican Favorites',
            'Mediterranean Delights',
            'Indian Spices',
            'French Elegance',
            'Middle Eastern Treasures',
            'Fusion Creations',
            'Hosting International Dinners'
          ],
          tone: 'enthusiastic',
          words_per_chapter: 2000
        },
        is_premium: false
      },
      {
        name: 'Baking & Pastry Guide',
        category: 'food',
        description: 'Master the art of baking with techniques for breads, pastries, cakes, and desserts.',
        preview_image: '/templates/baking.png',
        structure: {
          chapters: [
            'Baking Fundamentals',
            'Essential Equipment',
            'Understanding Ingredients',
            'Quick Breads & Muffins',
            'Yeast Breads',
            'Cookies & Bars',
            'Cakes & Cupcakes',
            'Pies & Tarts',
            'Pastries & Croissants',
            'Decorating Techniques'
          ],
          tone: 'instructional',
          words_per_chapter: 1800
        },
        is_premium: true
      },

      // ============ MUSIC & ARTS TEMPLATES ============
      {
        name: 'Music Theory & Practice',
        category: 'hobby',
        description: 'Learn music theory and improve your playing with this comprehensive guide.',
        preview_image: '/templates/music.png',
        structure: {
          chapters: [
            'Introduction to Music',
            'Reading Sheet Music',
            'Rhythm & Time Signatures',
            'Scales & Keys',
            'Chords & Harmony',
            'Melody Writing',
            'Practice Techniques',
            'Playing by Ear',
            'Music Styles & Genres',
            'Performing & Recording'
          ],
          tone: 'educational',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Drawing & Illustration',
        category: 'hobby',
        description: 'Develop your artistic skills from basic drawing to professional illustration.',
        preview_image: '/templates/drawing.png',
        structure: {
          chapters: [
            'Getting Started with Drawing',
            'Lines & Shapes',
            'Light & Shadow',
            'Perspective Basics',
            'Drawing People',
            'Drawing Nature',
            'Digital Illustration',
            'Developing Your Style',
            'Creating a Portfolio',
            'Selling Your Art'
          ],
          tone: 'encouraging',
          words_per_chapter: 1600
        },
        is_premium: false
      },

      // ============ PET CARE TEMPLATES ============
      {
        name: 'Dog Training Guide',
        category: 'pets',
        description: 'Complete dog training from puppyhood to advanced commands using positive methods.',
        preview_image: '/templates/dog-training.png',
        structure: {
          chapters: [
            'Understanding Dog Behavior',
            'Setting Up for Success',
            'Basic Commands',
            'House Training',
            'Leash Training',
            'Socialization',
            'Problem Behaviors',
            'Advanced Training',
            'Mental Stimulation',
            'Lifelong Learning'
          ],
          tone: 'friendly',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Complete Pet Care',
        category: 'pets',
        description: 'Everything you need to know about caring for dogs, cats, and other pets.',
        preview_image: '/templates/pet-care.png',
        structure: {
          chapters: [
            'Choosing the Right Pet',
            'Preparing Your Home',
            'Nutrition & Feeding',
            'Health & Veterinary Care',
            'Grooming Basics',
            'Exercise & Play',
            'Behavior & Training',
            'Traveling with Pets',
            'Senior Pet Care',
            'Emergency Preparedness'
          ],
          tone: 'caring',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ GARDENING TEMPLATES ============
      {
        name: 'Home Gardening Guide',
        category: 'hobby',
        description: 'Start and maintain a beautiful garden with this beginner-friendly guide.',
        preview_image: '/templates/gardening.png',
        structure: {
          chapters: [
            'Planning Your Garden',
            'Understanding Soil',
            'Choosing Plants',
            'Planting Techniques',
            'Watering & Irrigation',
            'Fertilizing & Feeding',
            'Pest & Disease Control',
            'Seasonal Maintenance',
            'Container Gardening',
            'Harvesting & Enjoying'
          ],
          tone: 'friendly',
          words_per_chapter: 1600
        },
        is_premium: false
      },

      // ============ ENTREPRENEURSHIP TEMPLATES ============
      {
        name: 'E-Commerce Business Guide',
        category: 'business',
        description: 'Launch and grow a successful online store from product selection to scaling.',
        preview_image: '/templates/ecommerce.png',
        structure: {
          chapters: [
            'E-Commerce Opportunities',
            'Finding Your Niche',
            'Product Sourcing',
            'Building Your Store',
            'Payment & Shipping',
            'Product Photography',
            'SEO for E-Commerce',
            'Marketing Strategies',
            'Customer Service Excellence',
            'Scaling Your Business'
          ],
          tone: 'actionable',
          words_per_chapter: 2200
        },
        is_premium: true
      },
      {
        name: 'Freelancing Success',
        category: 'business',
        description: 'Build a thriving freelance career with strategies for finding clients and growing income.',
        preview_image: '/templates/freelancing.png',
        structure: {
          chapters: [
            'Is Freelancing Right for You?',
            'Defining Your Services',
            'Setting Your Rates',
            'Building Your Portfolio',
            'Finding Clients',
            'Proposals That Win',
            'Client Management',
            'Contracts & Invoicing',
            'Scaling as a Freelancer',
            'Building Passive Income'
          ],
          tone: 'motivational',
          words_per_chapter: 2000
        },
        is_premium: false
      },

      // ============ HISTORY & CULTURE TEMPLATES ============
      {
        name: 'Historical Non-Fiction',
        category: 'education',
        description: 'Write compelling historical narratives that bring the past to life.',
        preview_image: '/templates/history.png',
        structure: {
          chapters: [
            'Setting the Scene',
            'Historical Context',
            'Key Figures',
            'Events Unfold',
            'Turning Points',
            'Daily Life & Culture',
            'Impact & Consequences',
            'Legacy & Memory',
            'Lessons for Today',
            'Further Exploration'
          ],
          tone: 'narrative',
          words_per_chapter: 2500
        },
        is_premium: true
      },

      // ============ SCIENCE & NATURE TEMPLATES ============
      {
        name: 'Popular Science Book',
        category: 'education',
        description: 'Make complex scientific topics accessible and engaging for general readers.',
        preview_image: '/templates/science.png',
        structure: {
          chapters: [
            'The Big Question',
            'Historical Background',
            'Key Concepts Explained',
            'The Scientists',
            'Breakthrough Discoveries',
            'How It Works',
            'Real-World Applications',
            'Current Research',
            'Future Possibilities',
            'What It Means for You'
          ],
          tone: 'curious',
          words_per_chapter: 2200
        },
        is_premium: false
      },
      {
        name: 'Nature & Wildlife',
        category: 'education',
        description: 'Explore the natural world with guides to wildlife, ecosystems, and conservation.',
        preview_image: '/templates/nature.png',
        structure: {
          chapters: [
            'Introduction to the Ecosystem',
            'Flora & Plant Life',
            'Fauna & Wildlife',
            'Seasonal Changes',
            'Animal Behavior',
            'Food Chains & Webs',
            'Conservation Challenges',
            'Protecting Habitats',
            'Experiencing Nature',
            'How You Can Help'
          ],
          tone: 'educational',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ GAMING TEMPLATES ============
      {
        name: 'Video Game Strategy Guide',
        category: 'hobby',
        description: 'Create comprehensive game guides with walkthroughs, tips, and strategies.',
        preview_image: '/templates/gaming.png',
        structure: {
          chapters: [
            'Game Overview',
            'Getting Started',
            'Controls & Mechanics',
            'Character Guide',
            'Walkthrough Part 1',
            'Walkthrough Part 2',
            'Side Quests & Secrets',
            'Boss Strategies',
            'Achievement Guide',
            'Tips & Tricks'
          ],
          tone: 'enthusiastic',
          words_per_chapter: 2000
        },
        is_premium: false
      },

      // ============ POETRY TEMPLATES ============
      {
        name: 'Poetry Collection',
        category: 'fiction',
        description: 'Organize and present your poetry with thematic sections and author notes.',
        preview_image: '/templates/poetry.png',
        structure: {
          chapters: [
            'Preface',
            'Part I: Beginnings',
            'Part II: Love & Loss',
            'Part III: Nature & Seasons',
            'Part IV: Reflections',
            'Part V: Hope & Dreams',
            'Part VI: Social Commentary',
            'Part VII: Personal Journey',
            'Afterword',
            'About the Poet'
          ],
          tone: 'lyrical',
          words_per_chapter: 1000
        },
        is_premium: false
      },

      // ============ WEDDING & EVENTS TEMPLATES ============
      {
        name: 'Wedding Planning Guide',
        category: 'lifestyle',
        description: 'Plan your perfect wedding with timelines, budgets, and vendor checklists.',
        preview_image: '/templates/wedding.png',
        structure: {
          chapters: [
            'Getting Started',
            'Budget Planning',
            'Setting the Date & Venue',
            'Building Your Team',
            'The Guest List',
            'Attire & Beauty',
            'Flowers & Decor',
            'Food & Drink',
            'Music & Entertainment',
            'The Big Day Timeline'
          ],
          tone: 'excited',
          words_per_chapter: 1800
        },
        is_premium: false
      },
      {
        name: 'Event Planning Handbook',
        category: 'lifestyle',
        description: 'Professional event planning from corporate conferences to private celebrations.',
        preview_image: '/templates/events.png',
        structure: {
          chapters: [
            'Event Planning Fundamentals',
            'Defining Your Event',
            'Budget Management',
            'Venue Selection',
            'Vendor Coordination',
            'Marketing & Invitations',
            'Day-of Logistics',
            'Crisis Management',
            'Post-Event Follow-up',
            'Building Your Event Business'
          ],
          tone: 'professional',
          words_per_chapter: 2000
        },
        is_premium: true
      },

      // ============ LANGUAGE LEARNING TEMPLATES ============
      {
        name: 'Language Learning Guide',
        category: 'education',
        description: 'Structured approach to learning any new language with practical exercises.',
        preview_image: '/templates/language.png',
        structure: {
          chapters: [
            'Why Learn This Language?',
            'Pronunciation Basics',
            'Essential Vocabulary',
            'Basic Grammar',
            'Common Phrases',
            'Numbers, Dates & Time',
            'Practical Conversations',
            'Reading & Writing',
            'Cultural Context',
            'Continuing Your Journey'
          ],
          tone: 'encouraging',
          words_per_chapter: 1800
        },
        is_premium: false
      },

      // ============ RELATIONSHIP TEMPLATES ============
      {
        name: 'Relationship Improvement',
        category: 'self-help',
        description: 'Strengthen your relationships with communication tools and connection strategies.',
        preview_image: '/templates/relationships.png',
        structure: {
          chapters: [
            'Understanding Relationships',
            'Communication Foundations',
            'Active Listening',
            'Expressing Needs',
            'Conflict Resolution',
            'Building Trust',
            'Intimacy & Connection',
            'Supporting Growth',
            'Navigating Challenges',
            'Long-term Relationship Health'
          ],
          tone: 'warm',
          words_per_chapter: 1800
        },
        is_premium: false
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
