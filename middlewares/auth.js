// const model = require('../models/note'); 

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already.');
        return res.redirect('/user/profile');
    }
}

//check if user is authenticated 
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first!');
        return res.redirect('/user/login');
    }
};

// check if user is a professor
exports.isProf = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (user.prof === true) {
            return next(); 
        } else {
            req.flash('error', 'Access denied. Professor account required.');
            return res.redirect('/studentHomePage');
        }
    } catch (err) {
        next(err);
    }
};


//fill below later to handle non-logged-in users accessing a note preview, bookmark page, or deleting a note

// exports.isAuthor = (req, res, next) => {
// };
