const OpenAI = require("openai");
require("dotenv").config();

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function summarizeChanges(changeBuffer) {
  if (!openai) {
    console.log("No API Key – using fallback summary.");
    return `chore: ${changeBuffer.length} file(s) changed`;
  }

  const prompt = `Summarize this developer activity into a useful commit message:\n${JSON.stringify(changeBuffer, null, 2)}`;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("GPT summarizer error:", err.message);
    return `chore: summary of ${changeBuffer.length} changes`;
  }
}

// This uses OpenAI's API (for now - will implement dynamic model for multile LLM's) to summarize file changes into a commit message.
module.exports = { summarizeChanges };