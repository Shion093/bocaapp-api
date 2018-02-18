const { handler : errorHandler } = require('../../middlewares/errors');
const Boca = require('./model');

async function createBoca (req, res, next) {
  try {
    const boca = await (new Boca(req.body)).save();
    return res.status(200).json(boca);
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

module.exports = {
  createBoca,
};