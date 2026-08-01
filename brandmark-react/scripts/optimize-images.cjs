const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');

async function optimizeImages() {
  const files = fs.readdirSync(PUBLIC_DIR);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Process PNG and JPEG files
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const filePath = path.join(PUBLIC_DIR, file);
      const fileNameWithoutExt = path.basename(file, ext);
      
      const webpPath = path.join(PUBLIC_DIR, `${fileNameWithoutExt}.webp`);
      const avifPath = path.join(PUBLIC_DIR, `${fileNameWithoutExt}.avif`);
      
      console.log(`Processing: ${file}`);
      
      try {
        // Generate WebP
        if (!fs.existsSync(webpPath)) {
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          console.log(`  -> Generated ${fileNameWithoutExt}.webp`);
        }
        
        // Generate AVIF (even smaller than WebP)
        if (!fs.existsSync(avifPath)) {
          await sharp(filePath)
            .avif({ quality: 75 })
            .toFile(avifPath);
          console.log(`  -> Generated ${fileNameWithoutExt}.avif`);
        }
        
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
  
  console.log('Image optimization complete.');
}

optimizeImages();
