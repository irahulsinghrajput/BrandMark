const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send Contact Form Email
const sendContactEmail = async (contactData) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission - ${contactData.name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contactData.subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p>${contactData.message}</p>
            <hr>
            <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Send Career Application Email
const sendCareerEmail = async (applicationData, resumePath) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Job Application - ${applicationData.position}`,
        html: `
            <h2>New Job Application</h2>
            <p><strong>Position:</strong> ${applicationData.position}</p>
            <p><strong>Name:</strong> ${applicationData.name}</p>
            <p><strong>Email:</strong> ${applicationData.email}</p>
            <p><strong>Phone:</strong> ${applicationData.phone}</p>
            <p><strong>Experience:</strong> ${applicationData.experience || 'Not specified'}</p>
            <p><strong>Cover Letter:</strong></p>
            <p>${applicationData.coverLetter || 'Not provided'}</p>
            <hr>
            <p><small>Resume attached. Submitted on: ${new Date().toLocaleString()}</small></p>
        `,
        attachments: resumePath ? [{
            filename: resumePath.split('/').pop(),
            path: resumePath
        }] : []
    };

    await transporter.sendMail(mailOptions);
};

// Send Newsletter Welcome Email
const sendNewsletterWelcome = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to BrandMark Solutions Newsletter!',
        html: `
            <h2>Welcome to BrandMark Solutions!</h2>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll receive updates about our latest services, tips, and exclusive offers.</p>
            <br>
            <p>Best regards,<br>The BrandMark Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Send Auto-reply to Contact Form
const sendContactAutoReply = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting BrandMark Solutions',
        html: `
            <h2>Thank you for reaching out, ${name}!</h2>
            <p>We have received your message and will get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to explore our services at <a href="https://brandmarksolutions.site">brandmarksolutions.site</a></p>
            <br>
            <p>Best regards,<br>The BrandMark Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendContactEmail,
    sendCareerEmail,
    sendNewsletterWelcome,
    sendContactAutoReply
};
