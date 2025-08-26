const { Clipboard } = require('@napi-rs/clipboard');
const fs = require('fs');
const { PNG } = require('pngjs'); // npm install pngjs

const clipboard = new Clipboard();

try {
  // Read an image file (PNG, JPG, etc.)
  const imageBuffer = fs.readFileSync('./test.png');
  
  // For PNG files, you need to parse it to get dimensions
  const png = PNG.sync.read(imageBuffer);
  
  // Set image to clipboard (width, height, rgba buffer)
  clipboard.setImage(png.width, png.height, png.data);
  
  console.log('Image set to clipboard successfully!', png.height, png.width);
} catch (error) {
  console.error('Error setting image:', error.message);
}

// Get image from clipboard and save as PNG
async function getImageAsPNG(outputPath, width, height) {
  try {
    // Get the raw RGBA data from clipboard
    const rgbaBuffer = clipboard.getImage();
    
    // Create a new PNG with the correct dimensions
    const png = new PNG({
      width: width,
      height: height
    });
    
    // Copy the RGBA data to the PNG
    png.data = rgbaBuffer;
    
    // Write to file
    const outputStream = fs.createWriteStream(outputPath);
    png.pack().pipe(outputStream);
    
    // Wait for the write to complete
    await new Promise((resolve, reject) => {
      outputStream.on('finish', resolve);
      outputStream.on('error', reject);
    });
    
    console.log(`Image saved as PNG: ${outputPath}`);
    
  } catch (error) {
    console.error('Error saving image as PNG:', error.message);
  }
}

// Usage - you need to know the dimensions
getImageAsPNG('output-image.png', 2596, 1416); // Replace with actual dimensions