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
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Sending...';
    btn.disabled = true;
    btn.classList.add('opacity-75');

    // Simulate sending
    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75');
        e.target.reset();
        
        // Show toast
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('translate-y-24');
            setTimeout(() => {
                toast.classList.add('translate-y-24');
            }, 3000);
        }
    }, 1500);
}

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

