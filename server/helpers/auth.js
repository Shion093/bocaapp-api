const User = require('../api/users/model');
const jwt = require('jsonwebtoken');

async function refreshTokens (refreshToken) {
  let userId = -1;
  try {
    const { _id } = jwt.decode(refreshToken);
    userId = _id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    return {};
  }
  const tokens = await user.generateToken(user);
  return {
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    user,
  };
}

module.exports = {
  refreshTokens,
};
