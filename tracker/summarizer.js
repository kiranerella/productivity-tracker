require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// This function generates a summary of code changes using OpenAI's GPT model.
async function generateSummary(changes) {
    if (!changes.length) return "No code changes detected this period.";

    const prompt = `
Write a concise, human-readable summary of these file changes:\n
${changes.map(c => `- ${c.type} ${c.filePath}`).join('\n')}
`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
}

// This function saves the generated summary to a markdown file with a timestamp.
async function saveSummaryToFile(summary) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `summary-${timestamp}.md`;
    const dir = path.join(__dirname, '..', 'summaries');

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, summary, 'utf8');

    console.log(`Saved summary: ${filePath}`);
    return filePath;
}

module.exports = { generateSummary, saveSummaryToFile };
