const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

exports.validateSignup =     
[
    body('firstname', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastname', 'First name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 6 characters and at most 64 characters').isLength({ min: 6, max: 64 })
];

exports.validateLogin = [
    body('email', 'Must be a valid email address').isEmail().trim().escape(),
    body('password', 'Password must be at least 6 characters and at most 64 characters').isLength({ min: 6, max: 64 })
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) { 
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

// exports.validateId = (req, res, next)=>{
//     let id = req.params.id;
//     if(!id.match(/^[0-9a-fA-F]{24}$/)) {
//         let err = new Error('Invalid note id');
//         err.status = 400;
//         return next(err);
//     } else {
//         return next();
//     }
// };