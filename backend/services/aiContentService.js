/**
 * aiContentService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles autonomous content generation, including generating text posts via Gemini,
 * and generating videos programmatically using developer APIs (like Replicate/Luma),
 * bypassing the need for manual UI interactions on sites like OpenArt.
 */

const { generateGeminiResponse } = require('./geminiService');

/**
 * Programmatically generates a video using the Replicate API (or similar).
 * @param {string} prompt - The scheduled daily prompt
 * @returns {Promise<string>} The URL of the generated MP4 video
 */
const generateAIVideo = async (prompt) => {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.warn("⚠️ REPLICATE_API_TOKEN not configured. Video generation skipped.");
      return null;
    }

    console.log(`🎬 Requesting AI Video generation for prompt: "${prompt}"`);

    // Using a standard Text-to-Video model (e.g., stability-ai/stable-video-diffusion)
    const response = await fetch("https://api.replicate.com/v1/models/stability-ai/stable-video-diffusion/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          video_length: "14_frames_with_svd" // Example parameter
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Video API error: ${await response.text()}`);
    }

    const data = await response.json();
    return data.id; // Returns a prediction ID to poll for completion
  } catch (error) {
    console.error("❌ AI Video Generation Error:", error.message);
    throw error;
  }
};

/**
 * Generates highly engaging Instagram captions with hashtags.
 * @param {string} topic - The topic of the post
 * @returns {Promise<string>} The generated caption
 */
const generateInstagramCaption = async (topic) => {
  const systemPrompt = "You are an expert social media manager for BrandMark Solutions. Write an engaging, short Instagram caption with 5 relevant hashtags. Use emojis.";
  return await generateGeminiResponse(systemPrompt, topic);
};

module.exports = {
  generateAIVideo,
  generateInstagramCaption
};
