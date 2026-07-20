const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/blog
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, tag, page = 1, limit = 10 } = req.query;
        const query = { published: true };
        
        if (category) query.category = category;
        if (tag) query.tags = tag;

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-content'); // Exclude full content in list

        const count = await Blog.countDocuments(query);

        res.json({
            success: true,
            data: blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog posts'
        });
    }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, published: true });
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog post'
        });
    }
});

// @route   POST /api/blog
// @desc    Create new blog post (Admin only)
// @access  Private
router.post('/',
    auth,
    upload.single('featuredImage'),
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('author').trim().notEmpty().withMessage('Author is required'),
        body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
        body('content').trim().notEmpty().withMessage('Content is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { title, author, excerpt, content, category, tags, published } = req.body;
            const featuredImage = req.file ? req.file.path : null;

            // BrandMark 50 SEO Keywords list for auto-tagging
            const BRANDMARK_SEO_KEYWORDS = [
                "digital marketing company in patna", "best digital marketing agency in patna", "social media marketing company in patna",
                "seo services in patna", "web design company in patna", "branding agency in patna", "digital marketing agency in bihar",
                "best marketing company in patna", "social media management patna", "web development services patna", "seo agency in bihar",
                "online marketing company patna", "local seo services patna", "lead generation agency patna",
                "digital marketing agency purvanchal", "social media marketing purvanchal up", "best seo company eastern up",
                "web design services purvanchal up", "digital marketing agency eastern up", "branding company purvanchal up",
                "business marketing agency eastern up", "local business promotion purvanchal", "conversion-focused web design",
                "corporate branding bihar", "sme marketing consulting patna", "content writing services patna",
                "ecommerce website developer patna", "google ads management patna", "facebook ads agency patna",
                "performance marketing agency patna", "pay per click agency bihar", "b2b marketing services patna",
                "brand identity design bihar", "search engine optimization bihar", "graphic design company patna",
                "digital marketing for real estate patna", "school marketing agency bihar", "hospital digital marketing patna",
                "branding for startups bihar", "small business marketing bihar", "brandmark solutions", "brandmark solutions patna",
                "brandmark solutions bihar", "brandmark solutions website", "brandmark solutions seo audit",
                "digital marketing agency near me", "website developers near me", "seo company near me", "social media manager bihar",
                "top advertising agency patna"
            ];

            // Parse manually supplied tags
            let finalTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

            // Automatically inject up to 4 matching target keywords based on title/excerpt/content
            const scanText = `${title} ${excerpt} ${content}`.toLowerCase();
            const matchedKeywords = BRANDMARK_SEO_KEYWORDS.filter(kw => scanText.includes(kw.toLowerCase()));
            
            matchedKeywords.forEach(kw => {
                if (finalTags.length < 8 && !finalTags.some(t => t.toLowerCase() === kw.toLowerCase())) {
                    finalTags.push(kw);
                }
            });

            // If we still have very few tags, inject a couple of core local/brand tags at random
            if (finalTags.length < 3) {
                const fallbacks = BRANDMARK_SEO_KEYWORDS.filter(k => k.includes("patna") || k.includes("brandmark")).sort(() => 0.5 - Math.random());
                while (finalTags.length < 4 && fallbacks.length > 0) {
                    const fallback = fallbacks.pop();
                    if (!finalTags.some(t => t.toLowerCase() === fallback.toLowerCase())) {
                        finalTags.push(fallback);
                    }
                }
            }

            const blog = new Blog({
                title,
                author,
                excerpt,
                content,
                category,
                tags: finalTags,
                featuredImage,
                published: published === 'true'
            });

            await blog.save();

            res.status(201).json({
                success: true,
                message: 'Blog post created successfully',
                data: blog
            });
        } catch (error) {
            console.error('Blog creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create blog post'
            });
        }
    }
);

// @route   PUT /api/blog/:id
// @desc    Update blog post (Admin only)
// @access  Private
router.put('/:id', auth, upload.single('featuredImage'), async (req, res) => {
    try {
        const { title, author, excerpt, content, category, tags, published } = req.body;

        // BrandMark 50 SEO Keywords list for auto-tagging
        const BRANDMARK_SEO_KEYWORDS = [
            "digital marketing company in patna", "best digital marketing agency in patna", "social media marketing company in patna",
            "seo services in patna", "web design company in patna", "branding agency in patna", "digital marketing agency in bihar",
            "best marketing company in patna", "social media management patna", "web development services patna", "seo agency in bihar",
            "online marketing company patna", "local seo services patna", "lead generation agency patna",
            "digital marketing agency purvanchal", "social media marketing purvanchal up", "best seo company eastern up",
            "web design services purvanchal up", "digital marketing agency eastern up", "branding company purvanchal up",
            "business marketing agency eastern up", "local business promotion purvanchal", "conversion-focused web design",
            "corporate branding bihar", "sme marketing consulting patna", "content writing services patna",
            "ecommerce website developer patna", "google ads management patna", "facebook ads agency patna",
            "performance marketing agency patna", "pay per click agency bihar", "b2b marketing services patna",
            "brand identity design bihar", "search engine optimization bihar", "graphic design company patna",
            "digital marketing for real estate patna", "school marketing agency bihar", "hospital digital marketing patna",
            "branding for startups bihar", "small business marketing bihar", "brandmark solutions", "brandmark solutions patna",
            "brandmark solutions bihar", "brandmark solutions website", "brandmark solutions seo audit",
            "digital marketing agency near me", "website developers near me", "seo company near me", "social media manager bihar",
            "top advertising agency patna"
        ];

        // Parse manually supplied tags
        let finalTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

        // Scan title, excerpt, and content (fall back to existing database values if fields are not in the update payload)
        let scanText = '';
        if (title) scanText += ` ${title}`;
        if (excerpt) scanText += ` ${excerpt}`;
        if (content) scanText += ` ${content}`;
        scanText = scanText.toLowerCase();

        const matchedKeywords = BRANDMARK_SEO_KEYWORDS.filter(kw => scanText.includes(kw.toLowerCase()));
        
        matchedKeywords.forEach(kw => {
            if (finalTags.length < 8 && !finalTags.some(t => t.toLowerCase() === kw.toLowerCase())) {
                finalTags.push(kw);
            }
        });

        // If we still have very few tags, inject a couple of core local/brand tags at random
        if (finalTags.length < 3) {
            const fallbacks = BRANDMARK_SEO_KEYWORDS.filter(k => k.includes("patna") || k.includes("brandmark")).sort(() => 0.5 - Math.random());
            while (finalTags.length < 4 && fallbacks.length > 0) {
                const fallback = fallbacks.pop();
                if (!finalTags.some(t => t.toLowerCase() === fallback.toLowerCase())) {
                    finalTags.push(fallback);
                }
            }
        }

        const updateData = {
            title,
            author,
            excerpt,
            content,
            category,
            tags: finalTags,
            published: published === 'true',
            updatedAt: Date.now()
        };

        if (req.file) {
            updateData.featuredImage = req.file.path;
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post updated successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update blog post'
        });
    }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog post'
        });
    }
});

// @route   GET /api/blog/admin/all
// @desc    Get all blog posts including unpublished (Admin only)
// @access  Private
router.get('/admin/all', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Blog.countDocuments();

        res.json({
            success: true,
            data: blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog posts'
        });
    }
});

module.exports = router;
