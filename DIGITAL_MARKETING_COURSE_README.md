# BrandMark Digital Marketing Course - Setup & Implementation Guide

## 📚 Course Overview

A comprehensive **15-module Digital Marketing Course** with integrated **Generative AI** concepts and practical applications. Designed for beginners to advanced learners, this course teaches modern digital marketing strategies powered by AI tools.

### Course Structure

#### **Foundation Modules (1-3)**
- Module 1: Digital Marketing Fundamentals
- Module 2: Introduction to Gen AI for Marketing
- Module 3: Analytics & Metrics Fundamentals

#### **Content & Copywriting (4-6)**
- Module 4: AI-Powered Content Creation
- Module 5: SEO & AI-Enhanced Copywriting
- Module 6: Email Marketing & Automation

#### **Paid Advertising (7-9)**
- Module 7: Google Ads & AI Bidding Strategies
- Module 8: Facebook & Social Ads with AI
- Module 9: Performance Marketing & ROI Optimization

#### **Social Media & Influencer (10-12)**
- Module 10: Social Media Strategy with AI
- Module 11: Community Management & Engagement
- Module 12: Influencer Marketing Strategies

#### **Advanced Strategy (13-15)**
- Module 13: AI-Powered Personalization & Dynamic Content
- Module 14: MarTech Stack & AI Tools Integration
- Module 15: Case Studies & Real-World Applications (Capstone)

---

## 🚀 Quick Start

### Frontend Files Created

1. **Landing Page**: `digital-marketing-course.html`
   - Overview of all 15 modules
   - Learning objectives summary
   - Key AI tools highlighted
   - Course preview cards

2. **Module Pages** (Sample modules created):
   - `course-module-1.html` - Digital Marketing Fundamentals
   - `course-module-2.html` - Introduction to Gen AI for Marketing
   - `course-module-3.html` - Analytics & Metrics Fundamentals

3. **Navigation Integration**:
   - Course link added to main navigation in `index.html`
   - Mobile-friendly menu updated
   - Consistent styling with BrandMark theme

### Backend Files Created

1. **Database Models**:
   - `backend/models/Course.js` - Course data structure
   - `backend/models/Enrollment.js` - Student enrollment tracking

2. **API Routes**:
   - `backend/routes/courses.js` - Complete REST API for course management

3. **Server Integration**:
   - Routes registered in `backend/server.js`

---

## 🔧 Backend API Documentation

### Base URL
```
https://your-domain.com/api/courses
```

### Public Endpoints

#### Get All Courses
```
GET /api/courses
Query Parameters:
  - category: Filter by category (Foundation, Content & Copywriting, etc.)
  - level: Filter by level (Beginner, Intermediate, Advanced, Capstone)
  - sort: Sort order (newest, popular, rating, default)

Response:
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "...",
      "title": "Digital Marketing Fundamentals",
      "slug": "digital-marketing-fundamentals",
      "category": "Foundation",
      "level": "Beginner",
      "duration": 4,
      "moduleNumber": 1,
      "enrollmentCount": 0,
      "avgRating": 0,
      "learningObjectives": [...]
    }
  ]
}
```

#### Get Single Course by Slug
```
GET /api/courses/:slug

Example: GET /api/courses/digital-marketing-fundamentals
```

#### Get Course Categories
```
GET /api/courses/categories

Response:
{
  "success": true,
  "data": [
    "Foundation",
    "Content & Copywriting",
    "Paid Advertising",
    "Social Media & Influencer",
    "Advanced Strategy"
  ]
}
```

### Protected Endpoints (Requires Authentication)

#### Enroll in Course
```
POST /api/courses/enroll
Headers: Authorization: Bearer {token}
Body: {
  "courseId": "course_id_here"
}

Response:
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "id": "enrollment_id",
    "userId": "user_id",
    "courseId": "course_id",
    "status": "enrolled",
    "overallProgress": 0,
    "enrolledAt": "2025-01-15T..."
  }
}
```

#### Get User Enrollments
```
GET /api/courses/user/enrollments
Headers: Authorization: Bearer {token}

Response: Array of enrollment objects with course details
```

#### Update Course Progress
```
PATCH /api/courses/:courseId/progress
Headers: Authorization: Bearer {token}
Body: {
  "lessonId": "lesson_1",
  "timeSpent": 45  // minutes
}

Response: Updated enrollment with new progress percentage
```

#### Add Course Review
```
POST /api/courses/:courseId/review
Headers: Authorization: Bearer {token}
Body: {
  "rating": 5,
  "review": "Excellent course on AI in marketing!"
}

Response: Updated enrollment with review added
```

### Admin Endpoints

#### Create New Course
```
POST /api/courses
Headers: 
  - Authorization: Bearer {admin_token}
Body: {
  "title": "Module Title",
  "description": "...",
  "category": "Foundation",
  "level": "Beginner",
  "duration": 4,
  "moduleNumber": 16,
  "lessons": [...],
  "learningObjectives": [...]
}
```

#### Update Course
```
PATCH /api/courses/:id
Headers: Authorization: Bearer {admin_token}
Body: { fields to update }
```

#### Delete Course
```
DELETE /api/courses/:id
Headers: Authorization: Bearer {admin_token}
```

#### Publish/Unpublish Course
```
PATCH /api/courses/:id/publish
Headers: Authorization: Bearer {admin_token}
Body: {
  "isPublished": true  // or false
}
```

---

## 📝 Creating Additional Modules

### Template for New Module

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module X: Title | BrandMark Course</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand-black': '#0a0a0a',
                        'brand-dark': '#121212',
                        'brand-gray': '#1f1f1f',
                        'brand-accent': '#3b82f6'
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="brandmark.css">
</head>
<body>
    <!-- Copy nav from course-module-1.html and modify module details -->
    <!-- Copy lesson content structure -->
    <!-- Update next/previous module links -->
</body>
</html>
```

### Steps to Create New Module:
1. Duplicate `course-module-1.html` or `course-module-3.html`
2. Update module title, number, duration, and objectives
3. Write lesson content in the `.lesson-content` div
4. Update navigation links (previous/next modules)
5. Add downloadable resources
6. Test responsive design
7. Add to course landing page curriculum section

---

## 🛠️ Database Schema

### Course Collection
```javascript
{
  title: String,               // Module title
  slug: String,                // URL-friendly version (auto-generated)
  description: String,         // Full description
  category: String,            // Foundation, Content & Copywriting, etc.
  level: String,               // Beginner, Intermediate, Advanced, Capstone
  duration: Number,            // Hours
  moduleNumber: Number,        // 1-15 (unique)
  lessons: [{                  // Array of lessons
    title: String,
    duration: Number,          // Minutes
    videoUrl: String,          // Optional video
    content: String,           // HTML content
    resources: [String]        // File URLs
  }],
  learningObjectives: [String], // What students will learn
  aiToolsFocused: [String],    // AI tools covered (ChatGPT, Claude, etc.)
  videoIntro: {                // Optional intro video
    url: String,
    duration: Number
  },
  resources: {                 // Downloadable resources
    pdf: [String],
    xlsx: [String],
    docx: [String],
    other: [String]
  },
  isPublished: Boolean,        // Default: false
  enrollmentCount: Number,     // How many students
  avgRating: Number,           // 0-5
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Collection
```javascript
{
  userId: String,              // Student ID
  email: String,               // Student email
  courseId: ObjectId,          // Reference to Course
  completedLessons: [{         // Array of completed lessons
    lessonId: String,
    completedAt: Date,
    timeSpent: Number          // Minutes
  }],
  overallProgress: Number,     // 0-100%
  rating: Number,              // 1-5 (student review)
  review: String,              // Student review text
  status: String,              // enrolled, in-progress, completed, paused
  enrolledAt: Date,
  completedAt: Date,           // When finished (if completed)
  lastAccessedAt: Date
}
```

---

## 🎯 Integration Checklist

- [x] Course landing page created
- [x] 3 sample modules created (1, 2, 3)
- [x] Database models created (Course, Enrollment)
- [x] API routes implemented
- [x] Routes registered in server.js
- [x] Navigation updated in index.html
- [ ] Create remaining modules (4-15)
- [ ] Add video content to lessons
- [ ] Add downloadable resources
- [ ] Set up admin dashboard for course management
- [ ] Add course search/filtering on frontend
- [ ] Implement progress tracking UI
- [ ] Add email notifications for enrollments
- [ ] Create certificates for completed courses

---

## 🔌 Using the Course API

### Frontend Example: Fetching Courses
```javascript
// Get all courses
fetch('/api/courses')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get courses by category
fetch('/api/courses?category=Foundation&level=Beginner')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get single course
fetch('/api/courses/digital-marketing-fundamentals')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

### Frontend Example: Enrolling
```javascript
// Enroll user in course
fetch('/api/courses/enroll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    courseId: 'course_id_here'
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('Enrolled successfully!');
  }
});
```

### Frontend Example: Tracking Progress
```javascript
// Update progress
fetch(`/api/courses/${courseId}/progress`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    lessonId: 'lesson_1',
    timeSpent: 45  // minutes
  })
})
.then(res => res.json())
.then(data => console.log(data.data));
```

---

## 📊 Key AI Tools Covered

### Content Creation
- **ChatGPT (OpenAI)** - Leading conversational AI
- **Claude (Anthropic)** - Superior reasoning and analysis
- **Google Gemini** - Multimodal AI capabilities

### Image Generation
- **DALL-E** - Text-to-image generation
- **Midjourney** - High-quality artistic visuals
- **Adobe Firefly** - Design-focused AI

### Marketing Automation
- **Copy.ai & Jasper** - Marketing copywriting
- **HubSpot AI** - CRM with AI features
- **Make.com** - Workflow automation

### Analytics
- **Google Analytics 4** - Website analytics with ML
- **Mixed Panel** - Advanced user behavior tracking

---

## 🎓 Learning Paths

### Path 1: Beginner to Expert (All 15 Modules)
**Duration:** 60+ hours
- Foundation (12 hours)
- Content & Copywriting (12 hours)
- Paid Advertising (12 hours)
- Social Media (12 hours)
- Advanced Strategy (12 hours)

### Path 2: AI for Marketing Focus (6 Modules)
**Duration:** 24 hours
- Module 2: Intro to Gen AI
- Module 4: AI-Powered Content
- Module 8: AI Advertising
- Module 10: AI Social Media
- Module 13: AI Personalization
- Module 14: MarTech Stack

### Path 3: Hands-On Implementation (8 Modules)
**Duration:** 32 hours
**Focus:** Practical tools and execution

---

## 💡 Next Steps

1. **Create Remaining Modules** (4-15)
   - Follow the template structure from modules 1-3
   - Add specific AI tool demonstrations
   - Include real-world case studies

2. **Add Video Content**
   - Record intro videos for each module
   - Create tool demonstration videos
   - Add captions and transcripts

3. **Build Student Dashboard**
   - Progress tracking visualization
   - Download certificates
   - Access completed course materials
   - Social sharing for achievements

4. **Admin Course Management**
   - Create/edit/publish courses
   - Track enrollment metrics
   - Manage student reviews
   - Monitor course performance

5. **Email Integration**
   - Enrollment confirmation emails
   - Progress reminders
   - Course completion certificates
   - New module announcements

6. **Community Features**
   - Discussion forums per module
   - Q&A sections
   - Student showcases
   - Success stories

---

## 📝 Notes

- Course modules are published individually (use `isPublished` flag)
- Each module can work independently or as part of the full course
- Student progress is tracked lesson-by-lesson
- Ratings and reviews help improve future versions
- Analytics: Track enrollment trends, popular modules, completion rates

---

## Support & Updates

For questions or to add new modules:
1. Check existing module structure in `course-module-1.html`
2. Follow naming conventions: `course-module-{number}.html`
3. Keep API endpoints consistent
4. Test all links before deployment

**Last Updated:** January 2025
**Course Version:** 1.0
**Lead Instructor:** BrandMark Solutions Team
