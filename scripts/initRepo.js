// Initializes a local git repository in the current directory.
const { execSync } = require('child_process');

try {
  execSync('git init', { stdio: 'inherit' });
  console.log('✅ Local git repo initialized.');
} catch (e) {
  console.error('❌ Failed to init repo:', e);
}
