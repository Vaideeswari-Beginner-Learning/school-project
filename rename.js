const fs = require('fs');
const path = require('path');

const dir = 'c:\\\\Users\\\\Forge India Connect\\\\Documents\\\\school-project';

function walkDir(d) {
    let results = [];
    const list = fs.readdirSync(d);
    list.forEach(file => {
        file = path.join(d, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if(!file.includes('node_modules') && !file.includes('.git') && !file.includes('assets')) {
                results = results.concat(walkDir(file));
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.yaml')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(dir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace strict casing
    if (content.includes('Richmaan')) {
        content = content.replace(/Richmaan/g, 'Richmaan');
        modified = true;
    }
    if (content.includes('Richmaan')) {
        content = content.replace(/Richmaan/g, 'RICHMAAN');
        modified = true;
    }
    if (content.includes('Richmaan')) {
        content = content.replace(/Richmaan/g, 'richmaan');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(\`Updated \${file}\`);
    }
});
