// API Configuration
// Automatically detect if running on localhost, 127.0.0.1, or file:// (opened directly)
const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:';
const API_URL = isLocalhost 
    ? 'http://localhost:5000/api'     // Local Backend
    : 'https://brandmark-api-2026.onrender.com/api'; // Production Backend

// Mobile Menu Toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('contactSubmitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const messageDiv = document.getElementById('contactMessage');
        
        // Get form data
        const name = contactForm.querySelector('[name="name"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const phone = contactForm.querySelector('[name="phone"]').value.trim();
        const subject = contactForm.querySelector('[name="subject"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        
        // Enhanced form validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        
        // Validate all fields
        if (!name || name.length < 2) {
            messageDiv.className = 'text-center p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300';
            messageDiv.textContent = '❌ Please enter a valid name (at least 2 characters).';
            messageDiv.classList.remove('hidden');
            return;
        }
        
        if (!emailRegex.test(email)) {
            messageDiv.className = 'text-center p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300';
            messageDiv.textContent = '❌ Please enter a valid email address.';
            messageDiv.classList.remove('hidden');
            return;
        }
        
        if (phone && !phoneRegex.test(phone)) {
            messageDiv.className = 'text-center p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300';
            messageDiv.textContent = '❌ Please enter a valid phone number.';
            messageDiv.classList.remove('hidden');
            return;
        }
        
        if (!subject || subject.length < 3) {
            messageDiv.className = 'text-center p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300';
            messageDiv.textContent = '❌ Please enter a subject (at least 3 characters).';
            messageDiv.classList.remove('hidden');
            return;
        }
        
        if (!message || message.length < 10) {
            messageDiv.className = 'text-center p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300';
            messageDiv.textContent = '❌ Please enter a message (at least 10 characters).';
            messageDiv.classList.remove('hidden');
            return;
        }
        
        // Track contact form submit in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'engagement',
                'event_label': subject
            });
        }
        
        const formData = {
            name,
            email,
            phone: phone || '',
            subject,
            message
        };
        
        // Show enhanced loading state with cold-start warning
        btnText.textContent = 'Connecting...';
        btnSpinner.classList.remove('hidden');
        btn.disabled = true;
        
        // Show patience message for cold starts
        messageDiv.className = 'text-center p-4 rounded-lg bg-blue-100 text-blue-800 border border-blue-300';
        messageDiv.innerHTML = `
            <div class="flex items-center justify-center gap-2 mb-2">
                <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <strong>Connecting to secure server...</strong>
            </div>
            <p class="text-sm">Please wait while we establish a secure connection. This may take up to 30 seconds.</p>
            <p class="text-xs mt-1 opacity-75">Thank you for your patience!</p>
        `;
        messageDiv.classList.remove('hidden');

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Track successful contact form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_success', {
                        'event_category': 'conversion',
                        'event_label': 'contact_form'
                    });
                }
                
                // Success message
                messageDiv.className = 'text-center p-4 rounded-lg bg-green-100 text-green-800';
                messageDiv.textContent = data.message || 'Thank you! We will get back to you soon.';
                messageDiv.classList.remove('hidden');
                contactForm.reset();
            } else {
                // Error message
                messageDiv.className = 'text-center p-4 rounded-lg bg-red-100 text-red-800';
                messageDiv.textContent = data.message || 'Something went wrong. Please try again.';
                messageDiv.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            messageDiv.className = 'text-center p-4 rounded-lg bg-red-100 text-red-800';
            messageDiv.textContent = 'Failed to send message. Please check your connection.';
            messageDiv.classList.remove('hidden');
        } finally {
            // Reset button state
            btnText.textContent = 'Send Message';
            btnSpinner.classList.add('hidden');
            btn.disabled = false;
        }
    });
}

// Free SEO Audit Form Handling
const seoAuditForm = document.getElementById('seoAuditForm');
if (seoAuditForm) {
    seoAuditForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = seoAuditForm.querySelector('[name="name"]').value.trim();
        const email = seoAuditForm.querySelector('[name="email"]').value.trim();
        const phone = seoAuditForm.querySelector('[name="phone"]').value.trim();
        const website = seoAuditForm.querySelector('[name="website"]').value.trim();
        const notes = seoAuditForm.querySelector('[name="message"]').value.trim();

        const messageDiv = document.getElementById('seoAuditMessage');
        const btn = document.getElementById('seoAuditSubmitBtn');
        const btnText = document.getElementById('seoAuditBtnText');
        const btnSpinner = document.getElementById('seoAuditBtnSpinner');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i;

        if (!name || name.length < 2) {
            messageDiv.className = 'seo-audit-message';
            messageDiv.textContent = 'Please enter your full name.';
            messageDiv.style.background = '#fff3cd';
            messageDiv.style.color = '#7a5200';
            messageDiv.classList.remove('hidden');
            return;
        }

        if (!emailRegex.test(email)) {
            messageDiv.className = 'seo-audit-message';
            messageDiv.textContent = 'Please enter a valid email address.';
            messageDiv.style.background = '#fff3cd';
            messageDiv.style.color = '#7a5200';
            messageDiv.classList.remove('hidden');
            return;
        }

        if (!urlRegex.test(website)) {
            messageDiv.className = 'seo-audit-message';
            messageDiv.textContent = 'Please enter a valid website URL.';
            messageDiv.style.background = '#fff3cd';
            messageDiv.style.color = '#7a5200';
            messageDiv.classList.remove('hidden');
            return;
        }

        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_audit_request', {
                'event_category': 'engagement',
                'event_label': website
            });
        }

        const formData = {
            name,
            email,
            phone: phone || '',
            subject: 'Free SEO Audit Request',
            message: `Website: ${website}\nNotes: ${notes || 'No additional notes provided.'}`
        };

        btnText.textContent = 'Submitting...';
        btnSpinner.classList.remove('hidden');
        btn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'seo_audit_success', {
                        'event_category': 'conversion',
                        'event_label': 'free_seo_audit'
                    });
                }

                messageDiv.className = 'seo-audit-message';
                messageDiv.textContent = data.message || 'Request sent! We will email your audit shortly.';
                messageDiv.style.background = '#e6f4ea';
                messageDiv.style.color = '#1e6b3f';
                messageDiv.classList.remove('hidden');
                seoAuditForm.reset();
            } else {
                messageDiv.className = 'seo-audit-message';
                messageDiv.textContent = data.message || 'Something went wrong. Please try again.';
                messageDiv.style.background = '#fdecea';
                messageDiv.style.color = '#7a1f1f';
                messageDiv.classList.remove('hidden');
            }
        } catch (error) {
            console.error('SEO audit form error:', error);
            messageDiv.className = 'seo-audit-message';
            messageDiv.textContent = 'Failed to send request. Please check your connection.';
            messageDiv.style.background = '#fdecea';
            messageDiv.style.color = '#7a1f1f';
            messageDiv.classList.remove('hidden');
        } finally {
            btnText.textContent = 'Request Free Audit';
            btnSpinner.classList.add('hidden');
            btn.disabled = false;
        }
    });
}

// Newsletter Form Handling
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('❌ Please enter a valid email address.');
            return;
        }
        
        // Track newsletter signup attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup_attempt', {
                'event_category': 'engagement'
            });
        }
        
        btn.innerText = 'Subscribing...';
        btn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailInput.value })
            });

            const data = await response.json();

            if (data.success) {
                // Track successful newsletter signup
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup_success', {
                        'event_category': 'conversion',
                        'event_label': 'newsletter'
                    });
                }
                
                alert('✅ ' + (data.message || 'Successfully subscribed to newsletter!'));
                form.reset();
            } else {
                alert('❌ ' + (data.message || 'Failed to subscribe. Please try again.'));
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            alert('❌ Failed to subscribe. Please check your connection.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});

// Intersection Observer for Fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// --- NEW JS FOR SERVICE CARDS ---
// Add staggered hover delay to list items
document.querySelectorAll('.service-card').forEach(card => {
    const listItems = card.querySelectorAll('li');
    
    card.addEventListener('mouseenter', () => {
        listItems.forEach((item, index) => {
            // Add a tiny delay based on index for a "waterfall" effect
            item.style.transitionDelay = `${index * 50}ms`;
        });
    });

    card.addEventListener('mouseleave', () => {
        listItems.forEach(item => {
            item.style.transitionDelay = '0ms';
        });
    });
});

// --- BACK TO TOP BUTTON ---
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    // Show button when scrolled down
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- IMPROVED NOTIFICATION SYSTEM ---
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-circle-check' : 
                 type === 'error' ? 'fa-circle-xmark' : 
                 'fa-circle-info';
    
    const iconColor = type === 'success' ? 'text-green-500' : 
                      type === 'error' ? 'text-red-500' : 
                      'text-blue-500';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fa-solid ${icon} ${iconColor} text-xl"></i>
            <div>
                <p class="font-medium text-sm">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// --- IMAGE LAZY LOADING ---
// Add loading="lazy" to all images that don't have it
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});

// --- FORM VALIDATION IMPROVEMENTS ---
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        // Real-time validation feedback
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.classList.add('border-red-500');
                input.classList.remove('border-green-500');
            } else {
                input.classList.remove('border-red-500');
                input.classList.add('border-green-500');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.remove('border-red-500');
            }
        });
    });
});

// --- KEYBOARD NAVIGATION IMPROVEMENTS ---
// Add visible focus indicators for keyboard users
let isUsingKeyboard = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-nav');
});

// --- BRANDMARK AI CHAT WIDGET ---
const CHAT_API_URL = `${API_URL}/chat`;

function createChatWidget() {
    if (document.getElementById('bm-chat-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'bm-chat-widget';
    widget.innerHTML = `
        <button id="bm-chat-toggle" aria-label="Open Brandmark AI chat">
            <img src="Brandmarkchatbot.PNG" alt="Chat with Brandmark" class="bm-chat-toggle-icon" onerror="this.src='💬'">
        </button>
        <div id="bm-chat-window" class="bm-chat-hidden" role="dialog" aria-label="Brandmark AI chat window">
            <div class="bm-chat-header">
                <div class="bm-chat-title">
                    <img src="https://www.brandmarksolutions.site/newlogoBrandMarksolutionsupdated.jpeg?v=2" alt="Brandmark logo" class="bm-chat-logo" onerror="this.onerror=null; this.src='https://www.brandmarksolutions.site/Brandmarklogo.jpeg?v=1';" />
                    <span>Ask Brandmark AI</span>
                </div>
                <button id="bm-chat-close" aria-label="Close chat">✖</button>
            </div>
            <div id="bm-chat-messages" class="bm-chat-messages" aria-live="polite">
                <div class="bm-chat-message bm-chat-bot">Hi! I'm Mark. How can I help grow your brand today?</div>
            </div>
            <div class="bm-chat-input-area">
                <input type="text" id="bm-chat-input" placeholder="Type a message..." />
                <button id="bm-chat-send" aria-label="Send message">➤</button>
            </div>
        </div>
    `;

    document.body.appendChild(widget);

    const toggleBtn = widget.querySelector('#bm-chat-toggle');
    const closeBtn = widget.querySelector('#bm-chat-close');
    const chatWindow = widget.querySelector('#bm-chat-window');
    const input = widget.querySelector('#bm-chat-input');
    const sendBtn = widget.querySelector('#bm-chat-send');

    const toggleChat = () => {
        const isOpening = chatWindow.classList.contains('bm-chat-hidden');
        chatWindow.classList.toggle('bm-chat-hidden');
        if (!chatWindow.classList.contains('bm-chat-hidden')) {
            input.focus();
            // Track chatbot opened
            if (typeof gtag !== 'undefined') {
                gtag('event', 'chatbot_opened', {
                    'event_category': 'engagement',
                    'event_label': 'brandmark_ai'
                });
            }
        }
    };

    const appendMessage = (text, type) => {
        const messages = widget.querySelector('#bm-chat-messages');
        const msg = document.createElement('div');
        msg.className = `bm-chat-message ${type}`;
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        return msg;
    };

    const sendMessage = async () => {
        const userText = input.value.trim();
        if (!userText) return;

        // Track chatbot message sent
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chatbot_message_sent', {
                'event_category': 'engagement',
                'event_label': 'brandmark_ai'
            });
        }

        appendMessage(userText, 'bm-chat-user');
        input.value = '';
        input.focus();

        sendBtn.disabled = true;
        input.disabled = true;

        const loadingMsg = appendMessage('Typing...', 'bm-chat-bot');
        loadingMsg.id = 'bm-chat-loading';

        try {
            const response = await fetch(CHAT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            let data = null;
            try {
                data = await response.json();
            } catch (parseError) {
                data = null;
            }

            loadingMsg.remove();

            if (!response.ok) {
                const fallbackMessage = (data && data.reply) ? data.reply : 'Service is temporarily unavailable. Please try again.';
                appendMessage(fallbackMessage, 'bm-chat-bot');
                return;
            }

            appendMessage((data && data.reply) ? data.reply : 'Sorry, I could not respond right now.', 'bm-chat-bot');
        } catch (error) {
            console.error('Chat error:', error);
            loadingMsg.textContent = 'Error connecting. Please try again.';
        } finally {
            sendBtn.disabled = false;
            input.disabled = false;
        }
    };

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createChatWidget();
});
