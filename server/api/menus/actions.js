const _ = require('lodash');
const shortid = require('shortid');
const { handler : errorHandler } = require('../../middlewares/errors');
const Menu = require('./model');
const Boca = require('../bocas/model');
const uploadS3 = require('../../helpers/s3');
const { optimizeImage } = require('../../helpers/image');

async function getAllMenus (req, res, next) {
  try {
    const menus = await Menu.find({ restaurant : req.user.restaurant }).populate('bocas').sort([['createdAt', -1]]);
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function createMenu (req, res, next) {
  try {
    const fileName = `menus/${shortid.generate()}.jpg`;
    const fileOptimized = await optimizeImage(req.file.buffer);
    const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
    req.body.picture = image.Location;
    req.body.restaurant = req.user.restaurant;
    const menu = await (new Menu(req.body)).save();
    return res.status(200).json(menu);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getMenuById (req, res, next) {
  try {
    const menu = await Menu.findOne({ _id : req.params.id }).populate('bocas').sort([['createdAt', -1]]);
    return res.status(200).json(menu);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function updateMenu (req, res, next) {
  try {
    if (_.has(req.file, 'buffer')) {
      const fileName = `menus/${shortid.generate()}.jpg`;
      const fileOptimized = await optimizeImage(req.file.buffer);
      const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
      req.body.picture = image.Location;
    }
    const menu = await Menu.findOneAndUpdate(
      { _id : req.body._id },
      { $set : req.body },
      { new : true }
    );
    const menus = await Menu.find({}).populate('bocas').sort([['createdAt', -1]]);
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}
async function deleteMenu (req, res) {
  try {
    const deletedMenu = await Menu.findByIdAndRemove(req.body.menuId);
    const bocas = await Boca.update({ _id : { $in : deletedMenu.bocas }}, { assigned : false }, { multi: true });
    const menus = await Menu.find({}).populate('bocas').sort([['createdAt', -1]]);
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}


module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};