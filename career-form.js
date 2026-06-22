// Career Application Form Handler
// Production backend
const API_URL = 'https://brandmark-api-2026.onrender.com/api';
// For local development: 'http://localhost:5000/api'
// const API_URL = 'http://localhost:5000/api'

// ============= SECURITY HELPERS =============
function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    return token || '';
}

function setSafeText(element, text) {
    if (typeof text !== 'string') {
        element.textContent = '';
        return;
    }
    element.textContent = text;
}

// Initialize career application forms
document.addEventListener('DOMContentLoaded', () => {
    const careerForm = document.getElementById('careerApplicationForm');
    
    if (careerForm) {
        careerForm.addEventListener('submit', handleCareerSubmit);
    }
});

async function handleCareerSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('careerMessage');
    const originalBtnText = submitBtn.innerHTML;
    
    // Get form data
    const formData = new FormData();
    formData.append('position', form.querySelector('[name="position"]').value);
    formData.append('name', form.querySelector('[name="name"]').value);
    formData.append('email', form.querySelector('[name="email"]').value);
    formData.append('phone', form.querySelector('[name="phone"]').value);
    formData.append('experience', form.querySelector('[name="experience"]')?.value || '');
    formData.append('coverLetter', form.querySelector('[name="coverLetter"]')?.value || '');
    
    // Add resume file
    const resumeInput = form.querySelector('[name="resume"]');
    if (resumeInput.files[0]) {
        formData.append('resume', resumeInput.files[0]);
    }
    
    // Add portfolio file if exists
    const portfolioInput = form.querySelector('[name="portfolio"]');
    if (portfolioInput && portfolioInput.files[0]) {
        formData.append('portfolio', portfolioInput.files[0]);
    }
    
    // Update button state with enhanced loading message
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    submitBtn.disabled = true;
    
    // Show patience message for cold starts (SAFE: using createElement)
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'application-message info flex flex-col items-center gap-3';
    
    const spinnerIcon = document.createElement('i');
    spinnerIcon.className = 'fas fa-spinner fa-spin text-2xl';
    
    const title = document.createElement('strong');
    setSafeText(title, 'Connecting to secure server...');
    
    const description = document.createElement('p');
    setSafeText(description, 'Please wait while we establish a secure connection and upload your files. This may take up to 30 seconds.');
    
    const thanks = document.createElement('p');
    thanks.style.fontSize = '0.9em';
    thanks.style.opacity = '0.8';
    thanks.style.marginTop = '8px';
    setSafeText(thanks, 'Thank you for your patience!');
    
    loadingDiv.appendChild(spinnerIcon);
    loadingDiv.appendChild(title);
    loadingDiv.appendChild(description);
    loadingDiv.appendChild(thanks);
    
    messageDiv.replaceChildren(loadingDiv);
    messageDiv.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_URL}/careers`, {
            method: 'POST',
            headers: {
                'X-CSRF-Token': getCsrfToken()  // SECURITY: Add CSRF token
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success (SAFE: using createElement)
            const successDiv = document.createElement('div');
            successDiv.className = 'application-message success';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-check-circle';
            
            const title = document.createElement('strong');
            setSafeText(title, 'Application Submitted!');
            
            const message = document.createElement('p');
            setSafeText(message, data.message || 'Thank you for applying! We will review your application and get back to you soon.');
            
            successDiv.appendChild(icon);
            successDiv.appendChild(title);
            successDiv.appendChild(message);
            
            messageDiv.replaceChildren(successDiv);
            messageDiv.classList.remove('hidden');
            form.reset();
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Error (SAFE: using createElement)
            const errorDiv = document.createElement('div');
            errorDiv.className = 'application-message error';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-exclamation-circle';
            
            const title = document.createElement('strong');
            setSafeText(title, 'Submission Failed');
            
            const message = document.createElement('p');
            setSafeText(message, data.message || 'Something went wrong. Please try again.');
            
            errorDiv.appendChild(icon);
            errorDiv.appendChild(title);
            errorDiv.appendChild(message);
            
            messageDiv.replaceChildren(errorDiv);
            messageDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Career application error:', error);
        
        // Error (SAFE: using createElement)
        const errorDiv = document.createElement('div');
        errorDiv.className = 'application-message error';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-triangle';
        
        const title = document.createElement('strong');
        setSafeText(title, 'Connection Error');
        
        const message = document.createElement('p');
        setSafeText(message, 'Failed to submit application. Please check your internet connection and try again.');
        
        errorDiv.appendChild(icon);
        errorDiv.appendChild(title);
        errorDiv.appendChild(message);
        
        messageDiv.replaceChildren(errorDiv);
        messageDiv.classList.remove('hidden');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// File input preview
document.addEventListener('change', (e) => {
    if (e.target.type === 'file') {
        const fileInput = e.target;
        const fileName = fileInput.files[0]?.name || 'No file chosen';
        const label = fileInput.nextElementSibling;
        if (label && label.classList.contains('file-label')) {
            label.textContent = fileName;
        }
    }
});
