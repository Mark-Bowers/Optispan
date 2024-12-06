const sharp = require('sharp');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
    try {
        // Download logo from optispan.life
        const response = await fetch('https://optispan.life/logo.png');
        const buffer = await response.buffer();

        // Generate different sizes
        await sharp(buffer)
            .resize(512, 512)
            .png()
            .toFile(path.join(__dirname, '../public/logo512.png'));

        await sharp(buffer)
            .resize(192, 192)
            .png()
            .toFile(path.join(__dirname, '../public/logo192.png'));

        // Generate favicon (multiple sizes in one .ico file)
        await sharp(buffer)
            .resize(32, 32)
            .toFile(path.join(__dirname, '../public/favicon.ico'));

        console.log('Icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 