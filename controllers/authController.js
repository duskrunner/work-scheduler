const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Не удалось войти!',
    successRedirect: '/sites',
    successFlash: `Успешно вошли!`,
});

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Необходимо войти, чтобы создавать и редактировать площадки');
    res.redirect('/login');
};
