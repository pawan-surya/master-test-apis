const validator = require('../helpers/validation');
const Validator = require('validatorjs');


const userCreate = (req, res, next) => {
    const validateRule = {
        "email": "required|email",
        "password": "required|string|strict",
        "telephone": "required|string",
        "fullname": "required|string",
        "address": "required|string",
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

    // Tighten password policy
    Validator.register('strict', value => passwordRegex.test(value),
        'password must contain at least one uppercase letter, one lowercase letter and one number');

    validator(req.body, validateRule, { required: "can't be blank" }, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    status: "error",
                    errors: err.errors,
                    data: req.body
                });
        } else {
            next();
        }
    });
};



const loginUser = (req, res, next) => {
    const rule = {
        "email": "required|email",
        "password": "required|string|strict",
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

    // Tighten password policy
    Validator.register('strict', value => passwordRegex.test(value),
        'password must contain at least one uppercase letter, one lowercase letter and one number');
    validator(req.body, rule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });

};


const stepOne = (req, res, next) => {
    const rule = {
        "email": "required|email",
    }
    validator(req.body, rule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });

};

const changedPassword = (req, res, next) => {
    const rule = {
        "password": "required|string|strict",
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

    // Tighten password policy
    Validator.register('strict', value => passwordRegex.test(value),
        'password must contain at least one uppercase letter, one lowercase letter and one number');
    validator(req.body, rule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });

};





module.exports = {
    userCreate,
    loginUser,
    changedPassword,
    stepOne
};