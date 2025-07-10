const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const parser = new Parser();

// Fetches latest article from RSS & saves as markdown
async function addArticle() {
  let feed = await parser.parseURL('https://www.freecodecamp.org/news/rss/');
  const first = feed.items[0];
  const articlesDir = path.join(__dirname, '..', 'articles');
  if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);
  const filename = path.join(articlesDir, `article-${Date.now()}.md`);
  fs.writeFileSync(filename, `# ${first.title}\n\n${first.link}`);
  console.log(`Added article: ${first.title}`);
}

// Picks random existing article content
async function getRandomArticle() {
  const articlesDir = path.join(__dirname, '..', 'articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  if (!files.length) return "Fallback: No articles found.";
  const randomFile = files[Math.floor(Math.random() * files.length)];
  return fs.readFileSync(path.join(articlesDir, randomFile), 'utf8');
}

module.exports = { addArticle, getRandomArticle };
