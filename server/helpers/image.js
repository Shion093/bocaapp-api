const sharp = require('sharp');

function optimizeImage (buffer) {
  return sharp(buffer)
    .resize(700)
    .background({ r : 0, g : 0, b : 0, alpha : 0 })
    .flatten()
    .jpeg({ quality : 90 })
    .toBuffer();
}

module.exports = {
  optimizeImage,
};
