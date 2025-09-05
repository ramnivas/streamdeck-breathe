import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '../com.ramnivas.breath.sdPlugin/imgs/logo.svg');
const outputDir = path.join(__dirname, '../com.ramnivas.breath.sdPlugin/imgs/actions');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read SVG content
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Add a dark background since we have white lines
const svgWithBackground = svgContent.replace(
    '<svg xmlns="http://www.w3.org/2000/svg"',
    '<svg xmlns="http://www.w3.org/2000/svg" style="background-color: #1a1a1a"'
);

// Create a buffer from the modified SVG
const svgBuffer = Buffer.from(svgWithBackground);

// Convert to 72x72 PNG for standard resolution
sharp(svgBuffer)
    .resize(72, 72)
    .png()
    .toFile(path.join(outputDir, 'key.png'))
    .then(() => console.log('Created key.png (72x72)'))
    .catch(err => console.error('Error creating key.png:', err));

// Convert to 144x144 PNG for @2x resolution
sharp(svgBuffer)
    .resize(144, 144)
    .png()
    .toFile(path.join(outputDir, 'key@2x.png'))
    .then(() => console.log('Created key@2x.png (144x144)'))
    .catch(err => console.error('Error creating key@2x.png:', err));