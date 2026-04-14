const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

// HASH password
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// COMPARE password
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// GENERATE token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      pseudo: user.pseudo,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};