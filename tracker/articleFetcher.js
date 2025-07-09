const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();
const summaryMsg = await summarizeChanges(changeBuffer);

async function addArticle() {
  let feed = await parser.parseURL('https://www.freecodecamp.org/news/rss/');
  const first = feed.items[0];
  const filename = `articles/article-${Date.now()}.md`;
  fs.writeFileSync(filename, `# ${first.title}\n\n${first.link}`);
  console.log(`Added article: ${first.title}`);
}

module.exports = { addArticle };


// This code fetches the latest article from freeCodeCamp's RSS feed and saves it as a markdown file.
const { addArticle } = require('./articleFetcher');
// inside cron job
if (changeBuffer.length === 0) {
  await addArticle();
  await git.add('.');
  await git.commit(summaryMsg);
}

