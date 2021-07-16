const db = require('../models/rootModel');
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secreat_key = 'test';
const email = require('../helpers/sendMail');

async function bcryptPassword(password) {
    encryptedPwd = bcrypt.hash(password, saltRounds);
    return encryptedPwd;
}

async function bcryptComparePassword(pwd, encpassword) {
    isSame = bcrypt.compare(pwd, encpassword);
    return isSame;
}

/**
 * 
 * @param {email,password,fullname,telephone,address} req 
 * @param {data and message} res 
 * @returns 
 */
exports.signUp = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(422).send({
                success: false,
                errors: [
                    "Please submit proper sign up data in request body."
                ],
                status: "error"
            });
        }
        if ((req.body.email === '' || req.body.email === null)) {
            res.status(422).send({
                errors: {
                    meta: {
                        success: false,
                        message: "Failure."
                    },
                    errors: {
                        user: [
                            "Invalid Email. Must be an email."
                        ]
                    }
                }
            });
            return;
        }

        const hash = await bcryptPassword(req.body.password)
        const user = {
            email: req.body.email,
            fullName: req.body.fullname,
            telephone: req.body.telephone,
            password: hash,
            address: req.body.address
        }
        const data = await User.create(user)
        const code = 111111;
        email.SignUp({ email: req.body.email, subject: `Welcome!`, text: `Welcome ${req.body.fullname}.`, code: code })
        await User.update({ code: code }, {
            where: { id: data.id }
        })
        res.send({ status_code: 200, data: data, messsage: "Sign up Done." })
    } catch (err) {
        console.log(err)
        res.status(501).send(err.errors)
    }
};


exports.verify_email = async (req, res) => {
    try {
        const checkuser = await User.findOne({ where: { email: req.body.email } });
        if (req.body.code !== checkuser.code) {
            return res.status(422).send({ errors: { message: "Validation code is Invalid." } })
        }
        await User.update({ email_verify: true }, {
            where: { id: checkuser.id }
        })
        res.send({ message: "Email verified Now you can Login." })
    } catch (err) {
        res.status(501).send("Server Error.")
    }
};

exports.login = async (req, res) => {
    try {
        const checkuser = await User.findOne({ where: { email: req.body.email } });
        if (checkuser === null) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: "User does not registerd with this email address."
                },
                errors: [
                    "User does not registerd with this email address."
                ]
            });
        }

        const check_pass = await bcryptComparePassword(req.body.password, checkuser.password)

        if (!check_pass) {
            return res.status(406).send({
                meta: {
                    success: false,
                    message: "User password does not match."
                },
                errors: [
                    "User password does not match."
                ]
            });
        }

        var token = await jwt.sign({
            id: checkuser.id,
            email: checkuser.email,
            name: checkuser.fullName,
        }, secreat_key, { expiresIn: "1h" });

        storeToken(checkuser.id, token, checkuser.sign_in_count)
        res.send({ access_token: token, sign_in_count: checkuser.sign_in_count, message: `Welcome ${checkuser.fullName}` })

    } catch (err) {
        res.status(501).send("Server Error.")
    }
};

exports.forgetPasswordStepOne = async (req, res) => {
    try {
        const checkuser = await User.findOne({ where: { email: req.body.email } });
        if (checkuser === null) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: "User does not registerd with this email address."
                },
                errors: [
                    "User does not registerd with this email address."
                ]
            });
        }
        email.setpOne({ email: checkuser.email, subject: `Forget Password!`, text: `${checkuser.fullname}.`, code: 111122 })
        res.send({ message: "Please check user mail use code for forget passwod." })
    } catch (err) {
        res.status(501).send("Server Error.")
    }
};

exports.forgetPasswordStepTwo = async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        const checkuser = await User.findOne({ where: { email: email } });
        if (checkuser === null) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: "User does not registerd with this email address."
                },
                errors: [
                    "User does not registerd with this email address."
                ]
            });
        }
        const hash = await bcryptPassword(password)
        await User.update({ password: hash }, {
            where: { id: checkuser.id }
        })
        res.send({ message: "Password Reset Done." })
    } catch (err) {
        res.status(501).send("Server Error.")
    }
};

exports.changePassword = async (req, res) => {
    try {
        const password = req.body.old_password
        const password_new = req.body.password
        const checkuser = await User.findOne({ where: { id: req.params.id } });
        if (checkuser === null) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: "User does not registerd with this email address."
                },
                errors: [
                    "User does not registerd with this email address."
                ]
            });
        }

        const check_pass = await bcryptComparePassword(password, checkuser.password)
        if (!check_pass) {
            return res.status(406).send({
                meta: {
                    success: false,
                    message: "User password does not match."
                },
                errors: [
                    "User password does not match."
                ]
            });
        }
        if (password_new !== req.body.confirm_password) {
            return res.status(422).send({
                meta: {
                    success: false,
                    message: "Confirm password does not match."
                },
                errors: [
                    "Confirm password does not match."
                ]
            });
        }
        const hash = await bcryptPassword(password_new)
        await User.update({ password: hash }, {
            where: { id: checkuser.id }
        })
        res.send({ message: "Password changed." })
    } catch (err) {
        console.log(err)
        res.status(501).send("Server Error.")
    }
};

async function storeToken(id, token, count) {
    const currentDate = new Date();
    await User.update({
        tokens: token,
        sign_in_count: count + 1
    }, {
        where: { id: id }
    })
}
