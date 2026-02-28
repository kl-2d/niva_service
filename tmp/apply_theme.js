const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFiles() {
  const rootDir = path.join(__dirname, '..', 'src');
  
  walkDir(rootDir, (filePath) => {
    if (!filePath.endsWith('.tsx') || filePath.includes('Footer.tsx')) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Ordered specific text replacements to enforce contrast rules
    content = content.replace(/text-slate-900/g, 'text-gray-900');
    content = content.replace(/text-slate-800/g, 'text-gray-900');
    content = content.replace(/text-slate-700/g, 'text-gray-700');
    content = content.replace(/text-slate-600/g, 'text-gray-700');
    content = content.replace(/text-slate-500/g, 'text-gray-500');
    content = content.replace(/text-slate-400/g, 'text-gray-500');
    content = content.replace(/text-slate-300/g, 'text-gray-300');
    
    // Backgrounds and borders
    content = content.replace(/bg-slate-50/g, 'bg-gray-50');
    content = content.replace(/bg-slate-100/g, 'bg-gray-100');
    content = content.replace(/bg-slate-200/g, 'bg-gray-200');
    content = content.replace(/bg-slate-300/g, 'bg-gray-300');
    content = content.replace(/bg-slate-800/g, 'bg-gray-800');
    content = content.replace(/bg-slate-900/g, 'bg-gray-900');
    
    content = content.replace(/border-slate-50/g, 'border-gray-50');
    content = content.replace(/border-slate-100/g, 'border-gray-100');
    content = content.replace(/border-slate-200/g, 'border-gray-200');
    content = content.replace(/border-slate-300/g, 'border-gray-300');
    
    // Catch-all for any remaining slates across all modifiers
    content = content.replace(/slate-/g, 'gray-');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  });
}

processFiles();
