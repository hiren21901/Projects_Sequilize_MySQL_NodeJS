const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const url = require('url');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Handle image requests
  if (req.headers.host === 'images.mykhoj.org') {
    const imagePath = path.join(__dirname, req.url);

    // Parse the URL and extract the query parameters
    const parsedUrl = url.parse(req.url, true);
    const { width, height } = parsedUrl.query;

    // Determine the image format based on the file extension
    const fileExtension = path.extname(imagePath).toLowerCase();
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const format = supportedFormats.includes(fileExtension) ? fileExtension.substring(1) : 'jpeg';

    // Check if the requested image is an SVG
    if (fileExtension === '.svg') {
      // Handle SVG image separately
      fs.readFile(imagePath, 'utf-8', (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end('Image not found');
        } else {
          // Set the response headers for SVG
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/svg+xml');
          res.end(data);
        }
      });
    } else {
      // For other image formats, proceed with sharp processing
      fs.access(imagePath, fs.constants.R_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('Image not found');
        } else {
          // Create a readable stream for the image file
          const imageStream = fs.createReadStream(imagePath);

          // Perform image optimizations using sharp
          let sharpStream = sharp();
          sharpStream = sharpStream.rotate(); // Auto-rotate images based on EXIF orientation

          // Resize the image if requested
          if (width && height) {
            sharpStream = sharpStream.resize({ width: parseInt(width), height: parseInt(height), fit: 'cover', position: 'top' });
          }

          // Convert image to the desired format
          if (format !== 'jpeg') {
            sharpStream = sharpStream.toFormat(format);
          }

          // Optimize image quality and size
          sharpStream = sharpStream.jpeg({ quality: 80, progressive: true, optimizeScans: true });

          // Pipe the image stream through the sharp transformations and send the response
          res.statusCode = 200;
          res.setHeader('Content-Type', `image/${format}`);
          imageStream.pipe(sharpStream).pipe(res);
        }
      });
    }
  }
  // Handle other requests
  else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Image server is running on port ${PORT}`);
});