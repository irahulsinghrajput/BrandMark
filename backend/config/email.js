const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send contact form email to admin
const sendContactEmail = async (contactData) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials not configured. Skipping email send.');
            return { success: false, message: 'Email not configured' };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact Form Submission - ${contactData.subject || 'No Subject'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0B2C4D;">New Contact Form Submission</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${contactData.subject || 'Not provided'}</p>
                        <hr style="border: 1px solid #dee2e6; margin: 15px 0;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${contactData.message}</p>
                    </div>
                    <p style="color: #6c757d; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending contact email:', error);
        return { success: false, message: error.message };
    }
};

// Send auto-reply to contact form submitter
const sendContactAutoReply = async (email, name) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return { success: false, message: 'Email not configured' };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting BrandMark Solutions',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #F26A21;">Thank You for Reaching Out!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for contacting BrandMark Solutions. We have received your message and will get back to you as soon as possible.</p>
                    <p>Our team typically responds within 24-48 hours during business days.</p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>BrandMark Solutions</strong></p>
                        <p style="margin: 5px 0;">Empowering MSMEs with Creative Solutions</p>
                        <p style="margin: 5px 0;">Website: <a href="https://brandmarksolutions.site">brandmarksolutions.site</a></p>
                    </div>
                    <p style="color: #6c757d; font-size: 12px;">This is an automated message. Please do not reply directly to this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Auto-reply sent successfully' };
    } catch (error) {
        console.error('Error sending auto-reply:', error);
        return { success: false, message: error.message };
    }
};

// Send career application email to admin
const sendCareerEmail = async (applicationData) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials not configured. Skipping email send.');
            return { success: false, message: 'Email not configured' };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Career Application - ${applicationData.position}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0B2C4D;">New Career Application</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Position:</strong> ${applicationData.position}</p>
                        <p><strong>Name:</strong> ${applicationData.name}</p>
                        <p><strong>Email:</strong> ${applicationData.email}</p>
                        <p><strong>Phone:</strong> ${applicationData.phone}</p>
                        <p><strong>Experience:</strong> ${applicationData.experience || 'Not provided'}</p>
                        <p><strong>Portfolio:</strong> ${applicationData.portfolio || 'Not provided'}</p>
                        <hr style="border: 1px solid #dee2e6; margin: 15px 0;">
                        <p><strong>Cover Letter:</strong></p>
                        <p style="white-space: pre-wrap;">${applicationData.coverLetter || 'Not provided'}</p>
                        ${applicationData.resume ? `<p><strong>Resume:</strong> Attached or available in database</p>` : ''}
                    </div>
                    <p style="color: #6c757d; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending career email:', error);
        return { success: false, message: error.message };
    }
};

// Send newsletter welcome email
const sendNewsletterWelcome = async (email) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return { success: false, message: 'Email not configured' };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to BrandMark Solutions Newsletter!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #F26A21;">Welcome to Our Newsletter!</h2>
                    <p>Thank you for subscribing to BrandMark Solutions newsletter.</p>
                    <p>You'll now receive updates about:</p>
                    <ul>
                        <li>Latest branding trends and tips</li>
                        <li>Marketing insights for MSMEs</li>
                        <li>Company news and announcements</li>
                        <li>Exclusive offers and opportunities</li>
                    </ul>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>BrandMark Solutions</strong></p>
                        <p style="margin: 5px 0;">Empowering MSMEs with Creative Solutions</p>
                        <p style="margin: 5px 0;">Website: <a href="https://brandmarksolutions.site">brandmarksolutions.site</a></p>
                    </div>
                    <p style="color: #6c757d; font-size: 12px;">If you wish to unsubscribe, please contact us at ${process.env.EMAIL_USER}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, message: error.message };
    }
};

module.exports = {
    sendContactEmail,
    sendContactAutoReply,
    sendCareerEmail,
    sendNewsletterWelcome
};
