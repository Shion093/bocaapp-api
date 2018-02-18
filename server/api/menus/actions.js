const { handler : errorHandler } = require('../../middlewares/errors');
const Menu = require('./model');

async function createMenu (req, res, next) {
  try {
    const menu = await (new Menu(req.body)).save();
    return res.status(200).json(menu);
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

module.exports = {
  createMenu,
};