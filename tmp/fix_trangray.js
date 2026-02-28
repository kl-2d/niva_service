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

function fixTrangray() {
  const rootDir = path.join(__dirname, '..', 'src');
  
  walkDir(rootDir, (filePath) => {
    if (!filePath.endsWith('.tsx')) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/trangray/g, 'translate');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed trangray in ${filePath}`);
    }
  });
}

fixTrangray();
