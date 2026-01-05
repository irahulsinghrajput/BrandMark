// API Configuration
// Production backend
// const API_URL = 'https://brandmark-solutions.onrender.com/api';
// For local development: 'http://localhost:5000/api'
const API_URL = 'http://localhost:5000/api'

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
        const messageDiv = document.getElementById('contactMessage');
        const originalText = btn.innerText;
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('[name="name"]').value,
            email: contactForm.querySelector('[name="email"]').value,
            phone: contactForm.querySelector('[name="phone"]').value,
            subject: contactForm.querySelector('[name="subject"]').value,
            message: contactForm.querySelector('[name="message"]').value
        };
        
        // Update button state
        btn.innerText = 'Sending...';
        btn.disabled = true;
        btn.classList.add('opacity-75');
        messageDiv.classList.add('hidden');

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
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-75');
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
