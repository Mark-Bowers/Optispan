const fs = require('fs');
const path = require('path');

// Directories
const srcDir = path.join(__dirname, '../src');
const publicDir = path.join(__dirname, '../public');

// Ensure directories exist
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Copy directory recursively
function copyDir(src, dest) {
    ensureDirectoryExists(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Main build process
function build() {
    // Create necessary directories
    ensureDirectoryExists(path.join(publicDir, 'js'));
    ensureDirectoryExists(path.join(publicDir, 'css'));

    // Copy JS files
    copyDir(path.join(srcDir, 'js'), path.join(publicDir, 'js'));

    // Copy CSS files
    copyDir(path.join(srcDir, 'styles'), path.join(publicDir, 'css'));

    console.log('Build completed successfully!');
}

build();

