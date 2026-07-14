const fs = require('fs');
const path = require('path');

const replacements = {
  '#6E1E2B': '#512888',
  '#4E1520': '#361559',
  '#8B2535': '#7341B6',
  'bordeaux': 'violet',
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'public') {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  });
}

walk(path.join(__dirname, 'app'));
walk(path.join(__dirname, 'components'));
walk(path.join(__dirname, 'lib'));
replaceInFile(path.join(__dirname, 'tailwind.config.ts'));
