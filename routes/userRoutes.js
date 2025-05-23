const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
// const offerRoutes = require('./offerRoutes');
const { loginLimiter } = require('../middlewares/rateLimiters');
const { validateSignup, validateLogin, validateResult } = require('../middlewares/validator');

const router = express.Router();

router.get('/signup', isGuest, controller.new);

router.post('/signup', isGuest, validateSignup, validateResult, controller.create);

router.get('/login', isGuest, controller.getUserLogin);

router.post('/login', isGuest, loginLimiter, validateLogin, controller.login);

router.get('/logout', isLoggedIn, controller.logout);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/bookmarks', isLoggedIn, controller.showBookmarks);

router.post('/bookmarks/:id', isLoggedIn, controller.toggleBookmark);

module.exports = router;