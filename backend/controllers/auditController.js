const Lead = require('../models/Lead');
const { sendToN8nWebhook } = require('../services/n8nWebhookService');

const handleAuditSubmission = async (req, res) => {
  const { fullName, email, websiteUrl } = req.body;
  
  try {
    // Save the lead in MongoDB
    await Lead.create({ fullName, email, websiteUrl });

    // Call the n8n automation
    try {
      await sendToN8nWebhook({
        fullName,
        email,
        websiteUrl,
        source: "SEO Audit Form"
      });
    } catch (webhookError) {
      console.error("Audit automation trigger failed, but lead was saved:", webhookError);
      // Return success to user even if automation fails, so the lead is not lost
      return res.status(201).json({ 
        success: true, 
        message: "Your request has been saved successfully!" 
      });
    }
    
    res.status(201).json({ 
      success: true, 
      message: "Lead saved and automation triggered!" 
    });
  } catch (err) {
    console.error("Audit Controller Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save lead. Please try again." 
    });
  }
};

module.exports = { handleAuditSubmission };
