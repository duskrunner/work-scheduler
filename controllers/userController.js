const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Вход'});
};

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Регистрация'});
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Введите ФИО').notEmpty();
    req.checkBody('email', 'Введите Email').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        qmail_remove_subaddress: false,
    });
    req.checkBody('password', 'Введите пароль!').notEmpty();
    req.checkBody('confirm-password', 'Подтвердите пароль').notEmpty();
    req.checkBody('confirm-password', 'Пароли должны совпадать!').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map((err) => err.msg));
        res.render('register', {title: 'Регистрация', body: req.body, flashes: req.flash()});
        return;
    }
    next();
};

exports.register = async (req, res, next) => {
    let name;
    name = (req.connection.remoteAddress == '10.16.18.24') ? 'Николай Быковкий' : req.body.name;
    const user = new User({email: req.body.email, name: name, ip: req.connection.remoteAddress, level: 0});
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
};
