const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const parser = new Parser();

async function addArticle() {
  let feed = await parser.parseURL('https://www.freecodecamp.org/news/rss/');
  const first = feed.items[0];
  const url = first.link;

  let articleText = '';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Grab first 3 paragraphs as sample
    const paragraphs = $('p').slice(0, 3).map((i, el) => $(el).text()).get();
    articleText = paragraphs.join('\n\n');
  } catch (e) {
    console.error('Failed to fetch article content:', e.message);
    articleText = '(Content could not be loaded, see original link)';
  }

  const articlesDir = path.join(__dirname, '..', 'articles');
  if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);

  const filename = path.join(articlesDir, `article-${Date.now()}.md`);
  fs.writeFileSync(filename, 
`# ${first.title}

Original: ${url}

${articleText}`);

  console.log(`Added article: ${first.title}`);
}

async function getRandomArticle() {
  const articlesDir = path.join(__dirname, '..', 'articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  if (!files.length) return "Fallback: No articles found.";
  const randomFile = files[Math.floor(Math.random() * files.length)];
  return fs.readFileSync(path.join(articlesDir, randomFile), 'utf8');
}

module.exports = { addArticle, getRandomArticle };
