const _ = require('lodash');
const shortid = require('shortid');
const { handler : errorHandler } = require('../../middlewares/errors');
const Boca = require('./model');
const Menu = require('../menus/model');
const { optimizeImage } = require('../../helpers/image');
const uploadS3 = require('../../helpers/s3');

async function getAllBocas (req, res, next) {
  try {
    const menus = await Boca.find({ assigned : false }).sort([['createdAt', -1]]);
    return res.status(200).json(menus);
  } catch (err) {
    return errorHandler(error, req, res);
  }
}

async function createBoca (req, res, next) {
  try {
    const fileName = `bocas/${shortid.generate()}.jpg`;
    const fileOptimized = await optimizeImage(req.file.buffer);
    const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
    req.body.picture = image.Location;
    const boca = await (new Boca(req.body)).save();
    return res.status(200).json(boca);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function updateBoca (req, res, next) {
  try {
    if (_.has(req.file, 'buffer')) {
      console.log('hola');
      const fileName = `menus/${shortid.generate()}.jpg`;
      const fileOptimized = await optimizeImage(req.file.buffer);
      const image = await uploadS3({ bucket : 'bocaapp', fileName, data : fileOptimized });
      req.body.picture = image.Location;
    }
    const boca = await Boca.findOneAndUpdate(
      { _id : req.body._id },
      { $set : _.omit(req.body, ['menuId']) },
      { new : true }
    );
    const menu = await Menu.findOne({ _id : req.body.menuId }).populate('bocas').sort({ 'createdAt' : 'desc' });
    const bocas = await Boca.find({ assigned : false }).sort({ 'createdAt' : 'desc' });
    return res.status(200).json({ menu, bocas });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function assignBocaToMenu (req, res, next) {
  try {
    const { menuId, bocaId } = req.body;
    await Menu.findOneAndUpdate({ _id : menuId }, { $push : { bocas : bocaId } });
    const boca = await Boca.findOneAndUpdate({ _id : bocaId }, {
      $set : {
        assigned : true,
        menu     : menuId
      }
    }, { new : true });
    return res.status(200).json(boca);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function removeBocaFromMenu (req, res, next) {
  try {
    const { menuId, bocaId } = req.body;
    const menu = await Menu.findOneAndUpdate(
      { _id : menuId },
      { $pull : { bocas : bocaId } },
      { new : true })
      .populate('bocas');
    const boca = await Boca.findOneAndUpdate(
      { _id : bocaId },
      { $set : { assigned : false, menu : null } },
      { new : true }
    );
    return res.status(200).json({ boca, menu });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function getBocasByMenuId (_id) {
  try {
    const bocas = await Boca.find()
  } catch (err) {

  }
}

module.exports = {
  createBoca,
  updateBoca,
  getAllBocas,
  assignBocaToMenu,
  removeBocaFromMenu,
};