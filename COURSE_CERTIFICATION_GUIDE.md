# BrandMark Course Completion & Certification System
## Complete Implementation Guide

## 🎯 Overview
This document details the complete course completion, certification, and payment system implementation for BrandMark.

---

## 📋 Architecture Components

### 1. **Backend Models**
- ✅ **Enrollment.js** - Enhanced with quiz tracking and certificate fields
- ✅ **Course.js** - Already exists
- ✅ **Quiz Route** - New quiz submission and certificate generation

### 2. **Certificate Generation**
- ✅ **certificateGenerator.js** - Generates HTML certificates with QR codes
- QR codes point to verification page: `https://brandmarksolutions.site/verify-certificate?id=<CERT_ID>`

### 3. **Payment Integration**
- ✅ **Razorpay** - Order creation and payment verification
- ✅ **Email Delivery** - Nodemailer sends certificates after passing

---

## 🔧 Installation & Environment Setup

### Required Environment Variables (.env)
```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### Install Dependencies
```bash
cd backend
npm install qrcode razorpay
```

---

## 📡 API Endpoints

### **QUIZ ENDPOINTS**

#### 1. POST `/api/quiz/submit`
**Submit quiz and check for certification**

**Request:**
```javascript
POST /api/quiz/submit
Headers: { Authorization: "Bearer <token>" }

Body: {
    enrollmentId: "enrollment_id_here",
    courseId: "course_id",
    answers: [
        { questionId: 1, isCorrect: true },
        { questionId: 2, isCorrect: false },
        // ... more answers
    ],
    totalQuestions: 15
}
```

**Response (If Passing ≥ 80%):**
```json
{
    "success": true,
    "message": "Congratulations! You passed and earned your certificate!",
    "data": {
        "attempt": {
            "attemptNumber": 1,
            "score": 85,
            "totalQuestions": 15,
            "correctAnswers": 13,
            "isPassing": true
        },
        "isPassing": true,
        "score": 85,
        "highestScore": 85,
        "certificateData": {
            "certificateId": "CERT-1713284534567-ABC123XYZ",
            "verificationCode": "5A7B9C",
            "qrCode": "data:image/png;base64,...",
            "certificateUrl": "https://brandmarksolutions.site/verify-certificate?id=CERT-1713284534567-ABC123XYZ"
        }
    }
}
```

**Response (If Failing < 80%):**
```json
{
    "success": true,
    "message": "Your score: 75%. You need 80% to pass. Retake available after 24 hours.",
    "data": {
        "attempt": {
            "attemptNumber": 1,
            "score": 75,
            "totalQuestions": 15,
            "correctAnswers": 11,
            "isPassing": false,
            "nextRetakeAvailable": "2024-04-16T10:30:00Z"
        },
        "isPassing": false,
        "score": 75,
        "highestScore": 75,
        "certificateData": null
    }
}
```

**Key Features:**
- ✅ 80% passing threshold
- ✅ 24-hour retake wait period
- ✅ Highest score tracking
- ✅ Automatic certificate generation on pass
- ✅ Email delivery with certificate attachment

---

#### 2. GET `/api/quiz/enrollment/:enrollmentId`
**Get quiz history and progress**

**Request:**
```javascript
GET /api/quiz/enrollment/enrollment_id_here
Headers: { Authorization: "Bearer <token>" }
```

**Response:**
```json
{
    "success": true,
    "data": {
        "quizAttempts": [
            {
                "attemptNumber": 1,
                "score": 75,
                "totalQuestions": 15,
                "correctAnswers": 11,
                "attemptedAt": "2024-04-15T10:30:00Z",
                "nextRetakeAvailable": "2024-04-16T10:30:00Z",
                "isPassing": false
            }
        ],
        "highestScore": 75,
        "isPassed": false,
        "certificateInfo": null,
        "canRetake": true
    }
}
```

---

#### 3. GET `/api/quiz/verify-certificate/:certificateId`
**Public endpoint to verify certificate authenticity (No auth needed)**

**Request:**
```javascript
GET /api/quiz/verify-certificate/CERT-1713284534567-ABC123XYZ
```

**Response:**
```json
{
    "success": true,
    "data": {
        "studentName": "John Doe",
        "courseId": "course_id",
        "score": 88,
        "issuedAt": "2024-04-15T10:30:00Z",
        "certificateId": "CERT-1713284534567-ABC123XYZ",
        "verificationCode": "5A7B9C",
        "status": "valid"
    }
}
```

---

### **PAYMENT ENDPOINTS**

#### 1. POST `/api/courses/:courseId/order`
**Create Razorpay order for course enrollment**

**Request:**
```javascript
POST /api/courses/course_id/order
Headers: { Authorization: "Bearer <token>" }

Body: {
    studentName: "John Doe",
    email: "john@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "orderId": "order_J4J2i3Q8Dqkpk4",
        "amount": 99900,
        "currency": "INR",
        "courseTitle": "Digital Marketing Mastery with Gen AI",
        "studentName": "John Doe",
        "email": "john@example.com",
        "keyId": "rzp_live_xxxxxxxxxxxxx"
    }
}
```

---

#### 2. POST `/api/courses/payment/verify`
**Verify payment and create enrollment**

**Request:**
```javascript
POST /api/courses/payment/verify
Headers: { Authorization: "Bearer <token>" }

Body: {
    razorpay_order_id: "order_J4J2i3Q8Dqkpk4",
    razorpay_payment_id: "pay_J4J2iAP3Q6U7y9",
    razorpay_signature: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
    courseId: "course_id",
    studentName: "John Doe"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Payment verified and enrollment created",
    "data": {
        "enrollment": {
            "_id": "enrollment_id",
            "userId": "user_id",
            "courseId": "course_id",
            "studentName": "John Doe",
            "status": "enrolled",
            "enrolledAt": "2024-04-15T10:30:00Z"
        },
        "paymentId": "pay_J4J2iAP3Q6U7y9"
    }
}
```

---

### **PROGRESS TRACKING**

#### PATCH `/api/courses/:courseId/progress`
**Mark lesson as complete and update progress**

**Request:**
```javascript
PATCH /api/courses/course_id/progress
Headers: { Authorization: "Bearer <token>" }

Body: {
    lessonId: "lesson_1",
    timeSpent: 45  // minutes
}
```

**Response:**
```json
{
    "success": true,
    "message": "Progress updated",
    "data": {
        "_id": "enrollment_id",
        "overallProgress": 20,
        "totalCompletedLessons": 3,
        "completedLessons": [
            {
                "lessonId": "lesson_1",
                "completedAt": "2024-04-15T10:30:00Z",
                "timeSpent": 45
            }
        ],
        "status": "in-progress"
    }
}
```

---

## 💻 Frontend Integration Examples

### **1. Razorpay Payment Integration**

```html
<!-- Include Razorpay Script -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
async function initiatePayment(courseId, studentName, email) {
    try {
        // Step 1: Create order from backend
        const orderResponse = await fetch(`/api/courses/${courseId}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                studentName,
                email
            })
        });

        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message);

        // Step 2: Open Razorpay Checkout
        const options = {
            key: orderData.data.keyId,
            order_id: orderData.data.orderId,
            amount: orderData.data.amount,
            currency: orderData.data.currency,
            name: "BrandMark Solutions",
            description: orderData.data.courseTitle,
            image: "https://brandmarksolutions.site/new logoBrandMarkupdatedone.jpeg",
            prefill: {
                name: studentName,
                email: email
            },
            handler: function(response) {
                verifyPayment(
                    orderData.data.orderId,
                    response.razorpay_payment_id,
                    response.razorpay_signature,
                    courseId,
                    studentName
                );
            },
            theme: {
                color: "#F26A21"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment initiation failed: ' + error.message);
    }
}

async function verifyPayment(orderId, paymentId, signature, courseId, studentName) {
    try {
        const response = await fetch(`/api/courses/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                courseId,
                studentName
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('✅ Payment successful! You are now enrolled.');
            window.location.href = '/course-learning-page.html';
        } else {
            alert('❌ Payment verification failed: ' + result.message);
        }
    } catch (error) {
        console.error('Verification error:', error);
        alert('Error verifying payment');
    }
}
</script>

<!-- Enroll Button -->
<button onclick="initiatePayment('courseId123', 'John Doe', 'john@example.com')">
    Enroll Now - ₹999
</button>
```

---

### **2. Mark Lesson Complete Button**

```html
<button class="mark-complete-btn" data-lesson-id="lesson_1">
    ✓ Mark as Complete
</button>

<script>
document.querySelector('.mark-complete-btn').addEventListener('click', async function() {
    const lessonId = this.dataset.lessonId;
    const courseId = 'your_course_id';
    const timeSpent = 45; // minutes

    try {
        const response = await fetch(`/api/courses/${courseId}/progress`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                lessonId,
                timeSpent
            })
        });

        const result = await response.json();
        if (result.success) {
            // Update progress bar
            updateProgressBar(result.data.overallProgress);
            
            // Show completion message
            alert(`✅ Lesson complete! Progress: ${result.data.overallProgress}%`);

            // If 100% complete, show quiz access button
            if (result.data.overallProgress === 100) {
                document.getElementById('quiz-button').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error marking lesson complete:', error);
    }
});
</script>
```

---

### **3. Final Quiz Interface**

```html
<!-- Quiz Container (Only visible when all lessons are complete) -->
<div id="quiz-section" style="display: none;">
    <h2>🧠 Gen AI Mastery Quiz</h2>
    <p>Pass with 80% to earn your certificate!</p>

    <form id="quiz-form">
        <!-- Question 1 -->
        <div class="question">
            <h4>1. What is Generative AI?</h4>
            <label><input type="radio" name="q1" value="true"> AI that generates new content</label>
            <label><input type="radio" name="q1" value="false"> AI only for analysis</label>
        </div>

        <!-- Add more questions... -->

        <button type="submit" class="btn-primary">Submit Quiz</button>
    </form>
</div>

<script>
document.getElementById('quiz-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect answers
    const answers = [
        { questionId: 1, isCorrect: document.querySelector('input[name="q1"]:checked').value === 'true' },
        // ... more answers
    ];

    const totalQuestions = answers.length;

    try {
        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                enrollmentId: 'enrollment_id',
                courseId: 'course_id',
                answers,
                totalQuestions
            })
        });

        const result = await response.json();

        if (result.data.isPassing) {
            // Show success message and certificate download link
            alert(`🎉 Congratulations! You scored ${result.data.score}%!\n\nYour certificate is being sent to your email.`);
            
            // Display certificate QR code
            displayCertificate(result.data.certificateData);
        } else {
            alert(`Your score: ${result.data.score}%\nYou need 80% to pass.\nRetry after ${result.data.attempt.nextRetakeAvailable}`);
        }
    } catch (error) {
        console.error('Quiz submission error:', error);
    }
});

function displayCertificate(certData) {
    const certHTML = `
        <div class="certificate-modal">
            <h3>✅ Certificate Awarded!</h3>
            <p>Certificate ID: ${certData.certificateId}</p>
            <img src="${certData.qrCode}" alt="QR Code" style="width: 150px;">
            <p>Scan to verify: ${certData.certificateUrl}</p>
            <button onclick="downloadCertificate()">📥 Download Certificate</button>
        </div>
    `;
    document.getElementById('certificate-container').innerHTML = certHTML;
}
</script>
```

---

### **4. Certificate Verification Page**

```html
<!-- verify-certificate.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Verify Certificate</title>
</head>
<body>
    <div id="verification-result"></div>

    <script>
        // Get certificate ID from URL
        const params = new URLSearchParams(window.location.search);
        const certificateId = params.get('id');

        async function verifyCertificate() {
            try {
                const response = await fetch(`/api/quiz/verify-certificate/${certificateId}`);
                const result = await response.json();

                const container = document.getElementById('verification-result');

                if (result.success) {
                    container.innerHTML = `
                        <div class="verified">
                            <h1>✅ Certificate Verified</h1>
                            <p><strong>Student:</strong> ${result.data.studentName}</p>
                            <p><strong>Score:</strong> ${result.data.score}%</p>
                            <p><strong>Issued:</strong> ${new Date(result.data.issuedAt).toLocaleDateString()}</p>
                            <p><strong>Certificate ID:</strong> ${result.data.certificateId}</p>
                        </div>
                    `;
                } else {
                    container.innerHTML = '<h1>❌ Invalid Certificate</h1>';
                }
            } catch (error) {
                document.getElementById('verification-result').innerHTML = 
                    '<h1>❌ Verification Failed</h1>';
            }
        }

        verifyCertificate();
    </script>
</body>
</html>
```

---

## 📊 Database Schema Changes

### Enrollment Model Updates
```javascript
{
    // ... existing fields
    studentName: String,
    totalCompletedLessons: Number,
    
    // Quiz tracking
    quizAttempts: [{
        attemptNumber: Number,
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        attemptedAt: Date,
        nextRetakeAvailable: Date,
        isPassing: Boolean
    }],
    highest_score: Number,
    
    // Certificate
    certificateInfo: {
        certificateId: String,
        issuedAt: Date,
        certificateUrl: String,
        verificationCode: String,
        qrCode: String
    },
    
    status: ['enrolled', 'in-progress', 'certified'] // Updated enums
}
```

---

## 🔐 Security Considerations

1. **Auth Required**: All endpoints except certificate verification require JWT token
2. **Signature Verification**: Razorpay signatures verified on backend
3. **Rate Limiting**: Applied to all payment endpoints (100 requests/15 min)
4. **Enrollment Validation**: User can only access their own enrollments
5. **Passing Score Logic**: Cannot retake after passing

---

## 📧 Email Templates

### Certificate Email
- Includes certificate attachment (HTML format)
- QR code for verification
- Link to verification page
- Call-to-action for more courses

---

## 🚀 Next Steps for Complete Implementation

1. ✅ **Backend Done**:
   - Quiz submission endpoint
   - Payment processing (Razorpay)
   - Certificate generation
   - Email delivery
   - Progress tracking

2. ⏳ **Frontend To Do**:
   - Add "Enroll Now" button with payment modal
   - Add "Mark as Complete" buttons to lessons
   - Create quiz UI in module pages
   - Add certificate verification page
   - Create student dashboard

3. ⏳ **Additional Features**:
   - Admin dashboard to manage certificates
   - Analytics on course completion rates
   - Student certificates listing page
   - LinkedIn share integration

---

## 🆘 Troubleshooting

### "Payment system not configured"
- Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env

### "Error sending certificate email"
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Enable "Less secure app access" if using Gmail

### Certificate QR code not generating
- Ensure qrcode package is installed: `npm install qrcode`
- Check certificate URL is accessible

---

## 📞 Support
For implementation questions, refer to backend/routes/quiz.js and backend/utils/certificateGenerator.js

