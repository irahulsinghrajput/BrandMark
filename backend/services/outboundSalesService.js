/**
 * outboundSalesService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous SDR logic. Handles generating highly personalized cold emails 
 * and analyzing responses from leads to pivot them to WhatsApp closures.
 */

const { generateGeminiResponse } = require('./geminiService');

/**
 * Generates a hyper-personalized cold email for a specific lead.
 * @param {object} lead - The scraped lead data (name, company, industry, etc.)
 * @returns {Promise<string>} The HTML content of the cold email
 */
const generateColdEmail = async (lead) => {
  const systemPrompt = `
You are an elite B2B Sales Executive for BrandMark Solutions. 
Write a short, highly personalized cold email to the following lead.
Do not use generic templates. Focus on how BrandMark can help their specific company/industry.
End the email by asking for a quick 10-minute chat or suggesting they message you on WhatsApp.

Lead Info:
Name: ${lead.name}
Company: ${lead.company}
Industry: ${lead.industry || 'Unknown'}
`;

  return await generateGeminiResponse(systemPrompt, `Write the email body only (no subject line).`);
};

/**
 * Analyzes a client's reply to a cold email and categorizes their intent.
 * @param {string} emailBody - The body of the client's reply
 * @returns {Promise<object>} { intent: 'hot'|'warm'|'cold', suggestedReply: string }
 */
const analyzeReplyIntent = async (emailBody) => {
  const systemPrompt = `
Analyze the following email reply from a potential client.
Determine if their intent is HOT (ready to buy/meet), WARM (asking questions), or COLD (not interested).
Also, draft a short suggested reply. If HOT or WARM, heavily push them to click our WhatsApp link: https://wa.me/91XXXXXXXXXX
Respond ONLY in valid JSON format: { "intent": "hot|warm|cold", "suggestedReply": "..." }
`;

  const rawJson = await generateGeminiResponse(systemPrompt, emailBody);
  try {
    return JSON.parse(rawJson);
  } catch (e) {
    console.error("Failed to parse intent JSON", e);
    return { intent: "warm", suggestedReply: "Thank you for getting back to us. Let's chat on WhatsApp!" };
  }
};

module.exports = {
  generateColdEmail,
  analyzeReplyIntent
};
