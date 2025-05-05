const model = require('../models/user');
// const note = require('../models/note');
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

    let user = new model(req.body);
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
    model.findOne({ email: email })
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
                            const sessionUser = {
                                _id: user._id.toString(),
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                prof: user.prof
                            };
                            req.session.user = sessionUser;
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
    Promise.all([model.findById(id)])
        .then(results => {
            const [user] = results;
            res.render('./user/profile', { user });
        })
        .catch(err => next(err));
};

// exports.bookmarks = (req, res, next) => {
// };