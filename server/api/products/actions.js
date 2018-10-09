const _ = require('lodash');
const shortid = require('shortid');
const { handler : errorHandler } = require('../../middlewares/errors');
const Product = require('./model');
const Menu = require('../menus/model');
const { optimizeImage } = require('../../helpers/image');
const uploadS3 = require('../../helpers/s3');

async function getAllProducts (req, res, next) {
  try {
    const products = await Product.find({ assigned : false, store : req.user.store }).sort({'createdAt' : 'desc'});
    return res.status(200).json(products);
  } catch (err) {
    return errorHandler(error, req, res);
  }
}

async function createProduct (req, res, next) {
  try {
    const fileName = `products/${shortid.generate()}.jpg`;
    const fileOptimized = await optimizeImage(req.file.buffer);
    const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized }); // este no se si cambiarlo
    req.body.picture = image.Location;
    req.body.store = req.user.store;
    const product = await (new Product(req.body)).save();
    return res.status(200).json(product);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function updateProduct (req, res, next) {
  try {
    if (_.has(req.file, 'buffer')) {
      const fileName = `menus/${shortid.generate()}.jpg`;
      const fileOptimized = await optimizeImage(req.file.buffer);
      const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
      req.body.picture = image.Location;
    }
    const product = await Product.findOneAndUpdate(
      { _id : req.body._id },
      { $set : _.omit(req.body, ['menuId']) },
      { new : true }
    );
    const menu = await Menu.findOne({ _id : req.body.menuId }).populate('products').sort({ 'createdAt' : 'desc' });
    const products = await Product.find({ assigned : false, store : req.user.store }).sort({ 'createdAt' : 'desc' });
    return res.status(200).json({ menu, products });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function deleteProduct (req, res) {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.body.productId);
    const menu = await Menu.findOne({ _id : req.body.menuId }).populate('products').sort({ 'createdAt' : 'desc' });
    const products = await Product.find({ assigned : false, store : req.user.store }).sort({ 'createdAt' : 'desc' });
    return res.status(200).json({ menu, products });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function assignProductToMenu (req, res, next) {
  try {
    const { menuId, productId } = req.body;
    await Menu.findOneAndUpdate({ _id : menuId }, { $push : { products : productId } });
    const product = await Product.findOneAndUpdate({ _id : productId }, {
      $set : {
        assigned : true,
        menu     : menuId
      }
    }, { new : true });
    return res.status(200).json(product);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function removeProductFromMenu (req, res, next) {
  try {
    const { menuId, productId } = req.body;
    const menu = await Menu.findOneAndUpdate(
      { _id : menuId },
      { $pull : { products : productId } },
      { new : true })
      .populate('products');
    const product = await Product.findOneAndUpdate(
      { _id : productId },
      { $set : { assigned : false, menu : null } },
      { new : true }
    );
    return res.status(200).json({ product, menu });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getProductByMenuId (_id) {
  try {
    const product = await Product.find()
  } catch (err) {

  }
}

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  assignProductToMenu,
  removeProductFromMenu,
  deleteProduct,
};