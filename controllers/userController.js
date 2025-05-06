const User = require('../models/user');
const File = require('../models/file');
const { validationResult } = require('express-validator');

exports.new = (req, res) => {
    return res.render('user/signup');
};

exports.create = async (req, res, next) => {
    console.log('prof field= ', req.body.submitType);
    req.body.prof = req.body.submitType === "professor";

    const submitType = req.body.submitType;
    if (submitType === 'student') {
        res.redirect('/studentHomePage');
    } else if (submitType === 'professor') {
        res.redirect('/profHomePage');
    } else {
        res.redirect('/');
    }

    const errors = validationResult(req); // CHECK VALIDATION RESULTS
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error', errorMessages);
        return res.redirect('/user/signup');
    }

    let user = new User(req.body);
    console.log('full field= ', user);

    console.log("POST /user/signup hit");

    try {
        await Promise.race([
            user.save(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Save timeout")), 5000))
        ]);
        res.redirect('/user/login');
    } catch (err) {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/user/signup');
        }
        if (err.code === 11000) {
            req.flash('error', 'Email has been used');
            return res.redirect('/user/signup');
        }
        next(err);
    }
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'Wrong email address');
                res.redirect('/user/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            // build a session object that has prof identifier
                            const sessionmodel = {
                                _id: user._id.toString(),
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                prof: user.prof
                            };
                            req.session.user = sessionmodel;
                            req.flash('success', 'You have successfully logged in');
                            // redirect based on prof flag
                            return res.redirect(user.prof ? '/profHomePage' : '/studentHomePage');
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/user/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};

//GET /user/profile/:id - send details of user profile identified by id
exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), File.find({ uploader: id })])
        .then(results => {
            const [user, files] = results;
            res.render('./user/profile', { user, files });
        })
        .catch(err => next(err));
};

exports.toggleBookmark = async (req, res, next) => {
    const fileId = req.params.id;
    const userId = req.session.user._id;

    try {
        // load user
        const user = await User.findById(userId);
        // see if it’s already bookmarked
        const idx = user.bookmarks.findIndex(b => b.equals(fileId));
        if (idx === -1) {
            // add bookmark
            user.bookmarks.push(fileId);
            req.flash('success', 'Added bookmark');
        } else {
            // or remove it
            user.bookmarks.splice(idx, 1);
            req.flash('error', 'Removed bookmark');
        }
        await user.save();
        res.redirect('back');
    } catch (err) {
        next(err);
    }
};

exports.showBookmarks = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id)
            .populate('bookmarks');
        res.render('user/bookmarks', { notes: user.bookmarks });
    } catch (err) {
        next(err);
    }
};