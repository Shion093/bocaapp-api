const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Store = require('./model');
const User = require('../users/model');
const Menu = require('../menus/model');
const { createDomain } = require('../../helpers/route53');
const { isStoreOpen } = require('../../helpers/store');

async function createStore (req, res, next) {
  try {
    const url = `${req.body.domain}.bocaapp.com`;

    const user = await User.findOne({ email : req.body.email });
    if (_.isNull(user)) {
      return res.status(204).json({message : 'User not found'});
    }


    // vamos a crear subdominios para las paginas de ellos, lo que ellos quiera publicar sobre ellos
    // try {
    //   await createDomain(url);
    // } catch (err) {
    //   return errorHandler(err, req, res);
    // }

    req.body.admin = user._id;
    const store = await (new Store(req.body)).save();
    await User.findOneAndUpdate({ _id : user._id }, { role : 'admin' , store : store._id});
    return res.status(200).json(store);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}


// esto tenemos que pensarlo, porque un usuario tiene acceso a mucho o el super admin derecho a todo...
async function storeByUser (req, res, next) {
  try {
    const store = await Store.findOne({ admin : req.params.userId });
    return res.status(200).json({store});
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function storeByDomain (req, res, next) {
  try {
    const store = await Store.findOne({ domain : req.params.domain });
    const isOpen = await isStoreOpen(store._id);
    let menus = [];
    if (isOpen) {
      menus = await Menu.find({ store : store._id }).populate('products').sort({'createdAt' : 'desc'});
    }
    return res.status(200).json({store, menus});
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function allStores (req, res, next) {
  try {
    const stores = await Store.find().lean();
    return res.status(200).json({stores});
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function handleStore (req, res, next) {
  try {
    await Store.findOneAndUpdate({ _id : req.body._id }, { $set : { isOpen: req.body.isOpen }}, { new : true });
    return res.status(200).json({ updated: true });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  allStores,
  createStore,
  storeByUser,
  storeByDomain,
  handleStore,
};