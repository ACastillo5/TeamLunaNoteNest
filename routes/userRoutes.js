const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
// const offerRoutes = require('./offerRoutes');
const { loginLimiter } = require('../middlewares/rateLimiters');
const { validateSignup, validateLogin, validateResult } = require('../middlewares/validator');

const router = express.Router();

router.get('/signup', controller.new);

router.post('/signup', isGuest, validateSignup, validateResult, controller.create);

router.get('/login', isGuest, controller.getUserLogin);

router.post('/login', loginLimiter, isGuest, validateLogin, controller.login);

router.get('/profile', isLoggedIn, controller.profile);

router.get("/bookmarks", (req, res) => {
    res.render("user/bookmarks"); // Render user/bookmarks.ejs
});

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;