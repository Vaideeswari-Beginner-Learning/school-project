const fs = require('fs');
const path = require('path');

const dir = 'c:\\\\Users\\\\Forge India Connect\\\\Documents\\\\school-project';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const preloaderHTML = '    <!-- Preloader -->\n    <div id="preloader">\n        <div class="spinner"></div>\n        <div class="logo-icon"><i class="ph ph-planet"></i></div>\n    </div>';
const aosCSS = '    <!-- AOS CSS -->\n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n';
const aosJS = '    <!-- AOS JS -->\n    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n';

files.forEach(file => {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    if (!content.includes('id="preloader"')) {
        content = content.replace('<body>', '<body>\n' + preloaderHTML);
        modified = true;
    }
    
    if (!content.includes('aos.css')) {
        content = content.replace('</head>', aosCSS + '</head>');
        modified = true;
    }
    
    if (!content.includes('aos.js')) {
        if(content.includes('<script src="script.js"></script>')) {
            content = content.replace('<script src="script.js"></script>', aosJS + '    <script src="script.js"></script>');
        } else {
            content = content.replace('</body>', aosJS + '</body>');
        }
        modified = true;
    }
    
    if (content.includes('reveal')) {
        content = content.replace(/class="([^"]*)reveal([^"]*)"/g, 'class="$1$2" data-aos="fade-up" data-aos-duration="1000"');
        content = content.replace(/class="\\s+"/g, 'class=""');
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + file);
    }
});
