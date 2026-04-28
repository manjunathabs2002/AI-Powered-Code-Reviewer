const aiService = require("../services/ai.service");

const TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS, 10) || 10000;

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }

    // Normalize aiService call (support function export or named method)
    let aiCall;
    if (typeof aiService === 'function') {
      aiCall = aiService(code);
    } else if (aiService && typeof aiService.getReview === 'function') {
      aiCall = aiService.getReview(code);
    } else {
      aiCall = Promise.resolve({ success: false, error: 'AI service not available' });
    }

    // Race AI call against a timeout so the server doesn't hang
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve({ success: false, error: 'AI service timeout' }), TIMEOUT_MS)
    );

    const result = await Promise.race([aiCall, timeout]);

    // If AI failed or returned no data, respond without crashing
    if (!result || !result.success) {
      return res.status(503).json({
        success: false,
        error: result && result.error ? result.error : 'AI failed to provide a review',
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      review: result.data,
    });
  } catch (error) {
    console.error("Controller Crash:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
