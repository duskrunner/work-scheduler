exports.catchError = (fn) => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    };
};


exports.validationError = (err, req, res, next) => {
    if (!err.errors) return (next(err));
    const errorKey = Object.keys(err.errors);
    errorKey.forEach((key) => req.flash('error', err.errors[key].message));
    res.redirect('back');
};
