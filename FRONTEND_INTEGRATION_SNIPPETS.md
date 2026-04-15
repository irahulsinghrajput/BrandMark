# 🚀 BrandMark Course System - Frontend Quick Integration Guide

## Copy-Paste Ready Code Snippets

### **1. ADD ENROLL BUTTON TO COURSE PAGE**

Add this to `courses.html` in the Digital Marketing course card (where "Explore Course" button is):

```html
<!-- Replace the "Explore Course" button with this -->
<button onclick="startEnrollmentFlow('digital-marketing-course-id')" 
        class="w-full text-center bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3 rounded-lg transition-colors">
    Enroll Now - ₹999 <i class="fas fa-lock ml-2"></i>
</button>
```

---

### **2. ADD PAYMENT SCRIPT**

Add this JavaScript to the bottom of your course pages (before closing `</body>`):

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
// Get auth token from localStorage (set during login)
const authToken = localStorage.getItem('authToken');

async function startEnrollmentFlow(courseId) {
    // Get student info (you'll need to get this from user profile)
    const studentName = prompt('Enter your full name:');
    const email = prompt('Enter your email:');
    
    if (!studentName || !email) {
        alert('Please provide your name and email');
        return;
    }

    if (!authToken) {
        alert('Please login first');
        window.location.href = '/login.html';
        return;
    }

    try {
        // Step 1: Create payment order
        console.log('Creating payment order...');
        const orderResponse = await fetch(`/api/courses/${courseId}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                studentName: studentName,
                email: email
            })
        });

        const orderData = await orderResponse.json();
        
        if (!orderData.success) {
            alert('Error: ' + orderData.message);
            return;
        }

        const { orderId, amount, keyId, courseTitle } = orderData.data;

        // Step 2: Open Razorpay checkout
        const options = {
            key: keyId,
            order_id: orderId,
            amount: amount,
            currency: 'INR',
            name: 'BrandMark Solutions',
            description: courseTitle,
            image: 'https://brandmarksolutions.site/new logoBrandMarkupdatedone.jpeg',
            prefill: {
                name: studentName,
                email: email,
                contact: ''
            },
            handler: async function(response) {
                // Payment successful - now verify
                await verifyPayment(
                    orderId,
                    response.razorpay_payment_id,
                    response.razorpay_signature,
                    courseId,
                    studentName
                );
            },
            theme: {
                color: '#F26A21'
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment cancelled');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error('Error initiating payment:', error);
        alert('Payment initiation failed. Please try again.');
    }
}

async function verifyPayment(orderId, paymentId, signature, courseId, studentName) {
    try {
        console.log('Verifying payment...');
        
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
                courseId: courseId,
                studentName: studentName
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Payment successful! You are now enrolled in the course!');
            // Redirect to course learning page
            window.location.href = '/digital-marketing-course.html';
        } else {
            alert('❌ Payment verification failed: ' + result.message);
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        alert('Error verifying payment. Please contact support.');
    }
}
</script>
```

---

### **3. ADD "MARK AS COMPLETE" BUTTON TO LESSONS**

Add this button at the end of each course module (e.g., `course-module-1.html`):

```html
<!-- Add this before the "Next Module" navigation -->
<div style="background: linear-gradient(135deg, #F26A21 0%, #E65C17 100%); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
    <button id="mark-complete-btn" 
            onclick="markLessonComplete()"
            style="background: white; color: #F26A21; border: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; cursor: pointer; font-size: 16px;">
        ✓ Mark as Complete
    </button>
    <p id="complete-status" style="color: white; margin-top: 10px; font-size: 14px;"></p>
</div>

<!-- Add this JavaScript before closing </body> -->
<script>
const authToken = localStorage.getItem('authToken');
const enrollmentId = localStorage.getItem('currentEnrollmentId'); // Set this when student opens course
const courseId = 'COURSE_ID_HERE'; // Replace with actual course ID
const lessonId = 'lesson_1'; // Replace with actual lesson ID

async function markLessonComplete() {
    if (!authToken) {
        alert('Please login first');
        return;
    }

    const btn = document.getElementById('mark-complete-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';

    try {
        const response = await fetch(`/api/courses/${courseId}/progress`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                lessonId: lessonId,
                timeSpent: 45 // minutes spent on lesson
            })
        });

        const result = await response.json();

        if (result.success) {
            btn.textContent = '✅ Completed!';
            btn.style.background = '#4CAF50';
            
            const progressPercent = result.data.overallProgress;
            document.getElementById('complete-status').textContent = 
                `✨ Progress: ${progressPercent}%`;

            // If 100% complete, show quiz access
            if (progressPercent === 100) {
                setTimeout(() => {
                    alert('🎉 All lessons completed! You can now take the final quiz.');
                    document.getElementById('quiz-access').style.display = 'block';
                }, 1500);
            }

            // Disable button after click
            setTimeout(() => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            }, 2000);
        } else {
            alert('Error: ' + result.message);
            btn.disabled = false;
            btn.textContent = '✓ Mark as Complete';
        }
    } catch (error) {
        console.error('Error marking lesson complete:', error);
        alert('Error updating progress. Please try again.');
        btn.disabled = false;
        btn.textContent = '✓ Mark as Complete';
    }
}
</script>
```

---

### **4. ADD QUIZ INTERFACE**

Create file: `course-quiz.html` or add this to module pages:

```html
<!-- Quiz Container - Show only when progress is 100% -->
<div id="quiz-section" style="display: none; background: white; padding: 40px; border-radius: 15px; max-width: 800px; margin: 40px auto;">
    
    <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #0B2C4D; margin-bottom: 10px;">🧠 Gen AI Mastery Quiz</h1>
        <p style="color: #666; font-size: 16px;">
            Answer 15 questions correctly. You need <strong>80% (12+ correct)</strong> to earn your certificate!
        </p>
        <div style="background: linear-gradient(135deg, #F26A21 0%, #E65C17 100%); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
            Passing Score: <strong>80%</strong> | Time Limit: <strong>30 minutes</strong>
        </div>
    </div>

    <form id="quiz-form">
        <!-- QUESTION 1 -->
        <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-left: 4px solid #F26A21; border-radius: 8px;">
            <h4 style="color: #0B2C4D; margin-bottom: 12px;">1. What is Generative AI?</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="cursor: pointer;">
                    <input type="radio" name="q1" value="true" required> 
                    Artificial Intelligence that can create new content like text, images, and code
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="q1" value="false"> 
                    AI that only analyzes existing data
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="q1" value="false"> 
                    A type of human intelligence
                </label>
            </div>
        </div>

        <!-- QUESTION 2 -->
        <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-left: 4px solid #F26A21; border-radius: 8px;">
            <h4 style="color: #0B2C4D; margin-bottom: 12px;">2. Which of the following is a use case for Gen AI in marketing?</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="cursor: pointer;">
                    <input type="radio" name="q2" value="true" required> 
                    Creating personalized email copy using ChatGPT
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="q2" value="false"> 
                    Gen AI cannot be used in marketing
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="q2" value="false"> 
                    Only for technical content
                </label>
            </div>
        </div>

        <!-- Add more questions following the same pattern... -->
        <!-- Questions 3-15 go here -->

        <div style="text-align: center; margin-top: 40px;">
            <button type="submit" style="background: linear-gradient(135deg, #0B2C4D 0%, #081F36 100%); color: white; border: none; padding: 15px 40px; font-size: 18px; border-radius: 25px; cursor: pointer; font-weight: 600;">
                Submit Quiz & Check Score
            </button>
        </div>
    </form>

    <!-- Results Section (Hidden until form submitted) -->
    <div id="quiz-results" style="display: none; margin-top: 30px; text-align: center;">
        <div id="results-content"></div>
    </div>
</div>

<!-- JavaScript for Quiz -->
<script>
const authToken = localStorage.getItem('authToken');
const enrollmentId = localStorage.getItem('currentEnrollmentId');
const courseId = 'COURSE_ID_HERE';

// Show quiz when progress is 100%
function loadQuizIfReady() {
    // Check if progress is 100%, if yes, show quiz
    const progressPercent = localStorage.getItem('courseProgress');
    if (progressPercent === '100') {
        document.getElementById('quiz-section').style.display = 'block';
    }
}

document.getElementById('quiz-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect all answers (q1, q2, ... q15)
    const answers = [];
    for (let i = 1; i <= 15; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedOption) {
            answers.push({
                questionId: i,
                isCorrect: selectedOption.value === 'true'
            });
        }
    }

    const totalQuestions = 15;

    try {
        // Disable submit button
        document.querySelector('button[type="submit"]').disabled = true;
        document.querySelector('button[type="submit"]').textContent = '⏳ Submitting...';

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                enrollmentId: enrollmentId,
                courseId: courseId,
                answers: answers,
                totalQuestions: totalQuestions
            })
        });

        const result = await response.json();

        // Hide form, show results
        document.getElementById('quiz-form').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';

        if (result.data.isPassing) {
            // Passing score - show certificate
            const cert = result.data.certificateData;
            document.getElementById('results-content').innerHTML = `
                <div style="background: linear-gradient(135deg, #F26A21 0%, #E65C17 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 48px;">🎉 Congratulations!</h1>
                    <p style="font-size: 24px; margin: 15px 0;">You Passed!</p>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-top: 15px;">
                        <p style="margin: 5px 0;"><strong>Your Score: ${result.data.score}%</strong></p>
                        <p style="margin: 5px 0;">Passing Score: 80%</p>
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin-bottom: 20px;">
                    <h3 style="color: #0B2C4D; margin-bottom: 15px;">✓ Certificate Awarded</h3>
                    <p style="color: #666;">Your certificate has been automatically generated and sent to your email!</p>
                    
                    <div style="margin: 20px 0; padding: 20px; background: white; border: 2px solid #F26A21; border-radius: 10px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">Your Certificate QR Code:</p>
                        <img src="${cert.qrCode}" alt="Certificate QR" style="width: 120px; height: 120px;">
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                            Scan to verify: <a href="${cert.certificateUrl}" target="_blank" style="color: #F26A21; text-decoration: none;">${cert.certificateUrl}</a>
                        </p>
                    </div>

                    <p style="color: #999; font-size: 12px; margin-top: 15px;">
                        <strong>Certificate ID:</strong> ${cert.certificateId}<br/>
                        <strong>Verification Code:</strong> ${cert.verificationCode}
                    </p>
                </div>

                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="/courses.html" style="background: #0B2C4D; color: white; padding: 12px 25px; border-radius: 20px; text-decoration: none; font-weight: 600;">
                        Explore More Courses
                    </a>
                    <button onclick="shareLinkedIn('${cert.certificateId}')" style="background: #0A66C2; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: 600;">
                        Share on LinkedIn
                    </button>
                </div>
            `;
        } else {
            // Failing score
            const nextRetakeDate = new Date(result.data.attempt.nextRetakeAvailable).toLocaleDateString();
            document.getElementById('results-content').innerHTML = `
                <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">Your Score: ${result.data.score}%</h3>
                    <p>You need <strong>80%</strong> to pass and earn your certificate.</p>
                    <p>You got <strong>${result.data.attempt.correctAnswers} out of ${result.data.attempt.totalQuestions}</strong> questions correct.</p>
                </div>

                <div style="background: #e8f5e9; color: #2e7d32; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0;">📅 You can retake on:</h4>
                    <p style="font-size: 18px; margin: 10px 0;"><strong>${nextRetakeDate}</strong></p>
                    <p style="font-size: 14px; margin: 0;">The 24-hour wait gives you time to review the course materials.</p>
                </div>

                <div style="text-align: center;">
                    <button onclick="location.reload()" style="background: #0B2C4D; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: 600;">
                        Review Course & Retake Later
                    </button>
                </div>
            `;
        }

    } catch (error) {
        console.error('Quiz submission error:', error);
        document.getElementById('results-content').innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 10px;">
                <h4 style="margin-top: 0;">Error Submitting Quiz</h4>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="background: #c62828; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }

    // Re-enable button
    document.querySelector('button[type="submit"]').disabled = false;
    document.querySelector('button[type="submit"]').textContent = '✓ Submit Quiz';
});

// Show quiz when page loads if ready
window.addEventListener('DOMContentLoaded', loadQuizIfReady);
</script>
```

---

### **5. CERTIFICATE VERIFICATION PAGE**

Create file: `verify-certificate.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify BrandMark Certificate</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #0B2C4D 0%, #081F36 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 50px 40px;
            text-align: center;
        }
        .logo {
            margin-bottom: 30px;
        }
        .logo img {
            width: 80px;
            border-radius: 50%;
        }
        h1 {
            color: #0B2C4D;
            margin-bottom: 20px;
            font-size: 32px;
        }
        .verified-badge {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 25px;
            font-weight: 600;
        }
        .certificate-details {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            text-align: left;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #0B2C4D;
        }
        .detail-value {
            color: #666;
        }
        .qr-code {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border: 2px solid #F26A21;
            border-radius: 10px;
            display: inline-block;
        }
        .qr-code img {
            width: 150px;
            height: 150px;
        }
        .share-buttons {
            margin-top: 25px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .share-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
        }
        .share-linkedin {
            background: #0A66C2;
            color: white;
        }
        .share-linkedin:hover {
            box-shadow: 0 5px 15px rgba(10, 102, 194, 0.4);
        }
        .invalid-message {
            background: #ffebee;
            color: #c62828;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .loading {
            text-align: center;
            padding: 40px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #F26A21;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="new logoBrandMarkupdatedone.jpeg" alt="BrandMark">
        </div>
        
        <h1>Certificate Verification</h1>
        
        <div id="verification-result"></div>
    </div>

    <script>
        async function verifyCertificate() {
            const params = new URLSearchParams(window.location.search);
            const certificateId = params.get('id');

            const resultDiv = document.getElementById('verification-result');

            if (!certificateId) {
                resultDiv.innerHTML = `
                    <div class="invalid-message">
                        <h3>❌ Invalid Request</h3>
                        <p>No certificate ID provided.</p>
                    </div>
                `;
                return;
            }

            // Show loading state
            resultDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Verifying certificate...</p>
                </div>
            `;

            try {
                const response = await fetch(`/api/quiz/verify-certificate/${certificateId}`);
                const result = await response.json();

                if (result.success) {
                    const cert = result.data;
                    resultDiv.innerHTML = `
                        <div class="verified-badge">
                            ✓ Certificate Valid
                        </div>
                        
                        <div class="certificate-details">
                            <div class="detail-row">
                                <span class="detail-label">Student Name:</span>
                                <span class="detail-value">${cert.studentName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Score:</span>
                                <span class="detail-value"><strong>${cert.score}%</strong></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Issued Date:</span>
                                <span class="detail-value">${new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Certificate ID:</span>
                                <span class="detail-value" style="font-family: monospace; font-size: 12px;">${cert.certificateId}</span>
                            </div>
                        </div>

                        <p style="color: #666; font-size: 14px; margin: 20px 0;">
                            This certificate is authentic and has been verified. 
                            The holder has successfully completed the course and achieved the required passing score.
                        </p>

                        <div class="share-buttons">
                            <button class="share-btn share-linkedin" onclick="shareOnLinkedIn('${cert.studentName}', '${cert.score}')">
                                Share on LinkedIn
                            </button>
                            <button class="share-btn" style="background: #0B2C4D; color: white;" onclick="window.print()">
                                Print / Save as PDF
                            </button>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="invalid-message">
                            <h3>❌ Certificate Not Found</h3>
                            <p>This certificate ID could not be verified. Please check the URL and try again.</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Verification error:', error);
                resultDiv.innerHTML = `
                    <div class="invalid-message">
                        <h3>❌ Verification Error</h3>
                        <p>An error occurred while verifying the certificate.</p>
                    </div>
                `;
            }
        }

        function shareOnLinkedIn(studentName, score) {
            const url = window.location.href;
            const text = `I just completed the Digital Marketing Mastery with Gen AI course from @BrandMark Solutions and scored ${score}%! 🎓🚀 Verify my certificate: ${url}`;
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=BrandMark%20Certificate&summary=${encodeURIComponent(text)}`;
            window.open(linkedInUrl, '_blank');
        }

        // Verify on page load
        window.addEventListener('DOMContentLoaded', verifyCertificate);
    </script>
</body>
</html>
```

---

## 🎯 Implementation Checklist

- [ ] Copy payment script to course pages
- [ ] Add "Enroll Now" button to `courses.html`
- [ ] Add "Mark as Complete" button to each module
- [ ] Create quiz page with all 15 questions
- [ ] Create `verify-certificate.html` page
- [ ] Update `.env` with Razorpay and Email credentials
- [ ] Test payment flow in Razorpay test mode
- [ ] Test quiz submission
- [ ] Test certificate email delivery
- [ ] Test certificate verification page
- [ ] Deploy to production with Razorpay live keys

---

## 🔗 Quick Links

- **API Documentation**: See `COURSE_CERTIFICATION_GUIDE.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Backend Code**: `/backend/routes/quiz.js`, `/backend/utils/certificateGenerator.js`

