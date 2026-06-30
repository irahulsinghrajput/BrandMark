const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Email configuration
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

const transporter = nodemailer.createTransport(emailConfig);

/**
 * Generate a unique verification code for certificate
 */
function generateVerificationCode() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Generate QR Code as Data URL
 */
async function generateQRCode(certificateId, studentName) {
    try {
        const certificateUrl = `https://brandmarksolutions.site/verify-certificate?id=${certificateId}&code=${studentName.replace(/\s+/g, '_')}`;
        const qrCode = await QRCode.toDataURL(certificateUrl);
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

/**
 * Generate HTML Certificate (to be converted to PDF)
 */
function generateCertificateHTML(studentName, courseTitle, score, certificateId, qrCodeDataURL, issueDate) {
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrandMark Certificate - ${studentName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Outfit', Arial, sans-serif;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .certificate {
            width: 1000px;
            height: 700px;
            background: white;
            border: 3px solid #0B2C4D;
            position: relative;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(135deg, #0B2C4D 0%, #081F36 100%);
            z-index: 1;
        }
        
        .certificate-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 60px 80px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .brand-orange {
            color: #F26A21;
        }
        
        .badge {
            display: inline-block;
            background: rgba(242, 106, 33, 0.2);
            color: #F26A21;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
        }
        
        .main-content {
            text-align: center;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .certificate-title {
            font-size: 48px;
            font-weight: 700;
            color: #0B2C4D;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .statement {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .student-name {
            font-size: 42px;
            font-weight: 700;
            color: #F26A21;
            margin: 30px 0;
            text-decoration: underline;
            text-decoration-style: dashed;
            text-decoration-color: #0B2C4D;
        }
        
        .course-title {
            font-size: 20px;
            color: #0B2C4D;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .score-badge {
            display: inline-block;
            background: linear-gradient(135deg, #F26A21, #E65C17);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            margin: 15px 0;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #0B2C4D;
            padding-top: 20px;
            margin-top: 30px;
        }
        
        .footer-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        
        .signature {
            color: #0B2C4D;
            font-size: 14px;
            font-weight: 600;
        }
        
        .date {
            color: #666;
            font-size: 12px;
        }
        
        .cert-id {
            color: #999;
            font-size: 10px;
            font-family: monospace;
            word-break: break-all;
        }
        
        .qr-code {
            width: 080px;
            height: 80px;
            background: white;
            padding: 5px;
            border: 1px solid #0B2C4D;
            border-radius: 5px;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
        }
        
        .verified-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #F26A21;
            font-size: 12px;
            font-weight: 600;
        }
        
        .seal {
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 80px;
            height: 80px;
            border: 3px solid #F26A21;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #F26A21;
            font-weight: 700;
            background: rgba(242, 106, 33, 0.05);
            font-size: 12px;
            text-align: center;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="certificate-content">
            <div class="header">
                <div class="logo">Brand<span class="brand-orange">Mark</span></div>
                <div style="font-size: 14px; color: white; margin-top: 5px;">Digital Marketing Academy</div>
                <div class="badge">Certificate of Achievement</div>
            </div>
            
            <div class="main-content">
                <div class="certificate-title">Certificate of Completion</div>
                <div class="statement">
                    This is to certify that
                </div>
                <div class="student-name">${studentName}</div>
                <div class="statement">
                    has successfully completed the course
                </div>
                <div class="course-title">${courseTitle}</div>
                <div class="statement">
                    with a comprehensive understanding of digital marketing strategies integrated with Generative AI tools.
                </div>
                <div class="score-badge">Score: ${score}%</div>
            </div>
            
            <div class="footer">
                <div class="footer-section">
                    <div class="signature">BrandMark Solutions</div>
                    <div class="date">Issued: ${formattedDate}</div>
                    <div class="cert-id">Certificate ID: ${certificateId}</div>
                </div>
                <div class="qr-code">
                    <img src="${qrCodeDataURL}" alt="Certificate QR Code" />
                </div>
                <div class="footer-section">
                    <div class="verified-badge">
                        <span style="color: #F26A21;">✓</span> Verified
                    </div>
                    <div style="color: #999; font-size: 11px;">Scan QR code to verify</div>
                </div>
            </div>
        </div>
        
        <div class="seal">
            <div>VERIFIED<br/>CERTIFICATE</div>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Convert HTML to PNG/PDF using a headless browser approach
 * For production, use Puppeteer or similar
 */
async function generateCertificatePDF(studentName, courseTitle, score, certificateId, qrCodeDataURL) {
    try {
        // Generate certificate HTML
        const certificateHTML = generateCertificateHTML(
            studentName,
            courseTitle,
            score,
            certificateId,
            qrCodeDataURL,
            new Date()
        );
        
        // Save HTML to file temporarily (will be used by conversion service)
        const tempFileName = `cert_${certificateId}.html`;
        const tempFilePath = path.join(__dirname, '../temp', tempFileName);
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
        }
        
        fs.writeFileSync(tempFilePath, certificateHTML);
        
        return {
            html: certificateHTML,
            tempFile: tempFilePath,
            fileName: `BrandMark_Certification_${studentName.replace(/\s+/g, '_')}.html`
        };
    } catch (error) {
        console.error('Error generating certificate PDF:', error);
        throw error;
    }
}

/**
 * Send certificate via email
 */
async function sendCertificateEmail(studentEmail, studentName, certificateData) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `🎓 Your BrandMark Digital Marketing Certificate`,
            html: `
                <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0B2C4D 0%, #081F36 100%); padding: 30px; color: white; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 32px;">Congratulations! 🎉</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">You've Earned Your Certificate</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                            Hi <strong>${studentName}</strong>,
                        </p>
                        
                        <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
                            We're thrilled to inform you that you've successfully completed the <strong>Digital Marketing Mastery with Gen AI</strong> course! Your achievement demonstrates dedication and mastery of cutting-edge digital marketing and AI integration skills.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-left: 4px solid #F26A21; margin-bottom: 20px;">
                            <p style="margin: 0; color: #0B2C4D; font-weight: 600;">Your Certificate Details:</p>
                            <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">
                                <strong>Certificate ID:</strong> ${certificateData.certificateId}<br/>
                                <strong>Score:</strong> ${certificateData.score}%<br/>
                                <strong>Issued Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, rgba(242, 106, 33, 0.1) 0%, rgba(8, 31, 54, 0.1) 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 13px; color: #666; margin-bottom: 10px;">
                                <strong>Verify Your Certificate</strong>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                Visit: <a href="https://brandmarksolutions.site/verify-certificate?id=${certificateData.certificateId}" style="color: #F26A21; text-decoration: none;">brandmarksolutions.site/verify-certificate</a>
                            </p>
                        </div>
                        
                        <p style="font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Your certificate is attached to this email and can be downloaded, printed, and shared on LinkedIn to help advance your career.
                        </p>
                        
                        <div style="background: #0B2C4D; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
                            <a href="https://brandmarksolutions.site/courses.html" style="background: #F26A21; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600; display: inline-block;">
                                Explore More Courses
                            </a>
                        </div>
                        
                        <p style="font-size: 12px; color: #999; text-align: center; margin: 20px 0 0 0; border-top: 1px solid #ddd; padding-top: 20px;">
                            Best regards,<br/>
                            <strong>The BrandMark Team</strong><br/>
                            <em>Empowering your digital marketing journey with AI</em>
                        </p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: certificateData.fileName,
                    content: certificateData.html,
                    contentType: 'text/html'
                }
            ]
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Certificate email sent to ${studentEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending certificate email:', error);
        throw error;
    }
}

module.exports = {
    generateQRCode,
    generateCertificateHTML,
    generateCertificatePDF,
    sendCertificateEmail,
    generateVerificationCode
};
