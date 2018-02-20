const shortid = require('shortid');
const sharp = require('sharp');
const { handler : errorHandler } = require('../../middlewares/errors');
const Menu = require('./model');
const uploadS3 = require('../../helpers/s3');

async function getAllMenus (req, res, next) {
  try {
    const menus = await Menu.find({}).sort([['createdAt', -1]]);
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(error, req, res);
  }
}

async function createMenu (req, res, next) {
  try {
    const fileName = `menus/${shortid.generate()}.jpg`;
    const fileOptimized = await sharp(req.file.buffer)
      .resize(700)
      .background({ r : 0, g : 0, b : 0, alpha : 0 })
      .flatten()
      .jpeg({ quality : 90 })
      .toBuffer();
    const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
    req.body.picture = image.Location;
    const menu = await (new Menu(req.body)).save();
    return res.status(200).json(menu);
  } catch (err) {
    return errorHandler(error, req, res);
  }
}

module.exports = {
  createMenu,
  getAllMenus,
};