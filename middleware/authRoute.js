module.exports = (req, res, next) => {
    if (req.session.isLogggedIn === false || req.session.isLoggedIn === undefined) {
        return res.redirect('/login');
    }
    next();
}