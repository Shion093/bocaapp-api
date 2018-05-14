const sharp = require('sharp');

function optimizeImage (buffer) {
  return sharp(buffer)
    .resize(700)
    .background({ r : 255, g : 255, b : 255, alpha : 0 })
    .flatten()
    .jpeg({ quality : 90 })
    .toBuffer();
}

module.exports = {
  optimizeImage,
};
