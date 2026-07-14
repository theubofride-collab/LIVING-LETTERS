const fs = require('fs');
const path = require('path');

const replacements = {
  // Hex colors
  '#512888': '#483A58',
  '#361559': '#2D2338',
  '#7341B6': '#68587A',
  
  // RGBA colors in app/page.tsx for the hero image gradient
  'rgba(81, 40, 136, 0.85)': 'rgba(72, 58, 88, 0.90)',
  'rgba(54, 21, 89, 0.9)': 'rgba(45, 35, 56, 0.95)',
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
