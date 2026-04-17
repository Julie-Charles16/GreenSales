const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  updateUser,
  updatePassword,
  deleteAccount
} = require('../controllers/userController');

// UPDATE USER
router.put('/update', authMiddleware, updateUser);

// UPDATE PASSWORD
router.put('/password', authMiddleware, updatePassword);

// DELETE ACCOUNT
router.delete('/delete', authMiddleware, deleteAccount);

module.exports = router;