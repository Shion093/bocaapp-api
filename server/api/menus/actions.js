const _ = require('lodash');
const shortid = require('shortid');
const { handler : errorHandler } = require('../../middlewares/errors');
const Menu = require('./model');
const Product = require('../products/model');
const uploadS3 = require('../../helpers/s3');
const { isStoreOpen } = require('../../helpers/store');
const { optimizeImage } = require('../../helpers/image');

async function getAllMenus (req, res, next) {
  try {
    const isOpen = await isStoreOpen(req.user.store);
    const menus = await Menu.find({ store : req.user.store }).populate('products').sort({'createdAt' : 'desc'});
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getAllMenusClient (req, res, next) {
  try {
    const isOpen = await isStoreOpen(req.params.storeId);
    if (isOpen) {
      menus = await Menu.find({ store : req.params.storeId }).populate('products').sort({'createdAt' : 'desc'});
    } else {
      menus = await Menu.find({ store : req.params.storeId }).sort({'createdAt' : 'desc'});
    }
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
    req.body.store = req.user.store;
    const menu = await (new Menu(req.body)).save();
    return res.status(200).json(menu);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getMenuById (req, res, next) {
  try {
    let menu = await Menu.findOne({ _id : req.params.id }).populate('products').sort({'createdAt' : 'desc'});
    const isOpen = await isStoreOpen(menu.store);
    return res.status(200).json(isOpen ? menu : []);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getMenuByStoreId (req, res, next) {
  try {
    let menu = await Menu.findOne({ store : req.params.id }).populate('products').sort({'createdAt' : 'desc'});
    const isOpen = await isStoreOpen(menu.store);
    return res.status(200).json(isOpen ? menu : []);
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
    const menus = await Menu.find({ store : req.user.store }).populate('products').sort({'createdAt' : 'desc'});
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}
async function deleteMenu (req, res) {
  try {
    const deletedMenu = await Menu.findByIdAndRemove(req.body.menuId);
    const products = await Product.update({ _id : { $in : deletedMenu.products }}, { assigned : false }, { multi: true });
    const menus = await Menu.find({ store : req.user.store }).populate('products').sort({'createdAt' : 'desc'});
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}


module.exports = {
  getMenuByStoreId,
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getAllMenusClient,
};