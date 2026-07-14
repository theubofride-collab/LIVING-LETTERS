const fs = require('fs');
const path = require('path');

const replacements = {
  // Hex colors
  '#483A58': '#EA580C', // Primary (Orange 600)
  '#2D2338': '#9A3412', // Dark (Orange 800)
  '#68587A': '#F97316', // Light (Orange 500)
  
  // Background gradients with RGBA in app/page.tsx
  'rgba(72, 58, 88, 0.90)': 'rgba(234, 88, 12, 0.85)',
  'rgba(45, 35, 56, 0.95)': 'rgba(154, 52, 18, 0.90)',

  // Rename tailwind classes if they were 'violet'
  'brand-violet': 'brand-orange',
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
