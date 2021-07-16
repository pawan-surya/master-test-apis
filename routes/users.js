var express = require('express');
var router = express.Router();
const user = require('../controllers/userController')
const vaidation = require('../middlewares/validation-middleware')

router.post('/sign_up',vaidation.userCreate,user.signUp);

router.post('/verify_email',vaidation.loginUser,user.verify_email);

router.post('/login',user.login);

router.post('/forget_password/step_one',vaidation.stepOne,user.forgetPasswordStepOne);

router.post('/forget_password/step_two',user.forgetPasswordStepTwo);

router.patch('/changepassword/:id',vaidation.changedPassword, user.changePassword)

module.exports = router;
