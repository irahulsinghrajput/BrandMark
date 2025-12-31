// Career Application Form Handler
const API_URL = 'http://localhost:5001/api';

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
    
    // Update button state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    messageDiv.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}/careers`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success
            messageDiv.className = 'application-message success';
            messageDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Application Submitted!</strong>
                <p>${data.message || 'Thank you for applying! We will review your application and get back to you soon.'}</p>
            `;
            messageDiv.classList.remove('hidden');
            form.reset();
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Error
            messageDiv.className = 'application-message error';
            messageDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <strong>Submission Failed</strong>
                <p>${data.message || 'Something went wrong. Please try again.'}</p>
            `;
            messageDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Career application error:', error);
        messageDiv.className = 'application-message error';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Connection Error</strong>
            <p>Failed to submit application. Please check your internet connection and try again.</p>
        `;
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
