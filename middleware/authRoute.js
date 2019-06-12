module.exports = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    if (req.session.isLogggedIn === false || req.session.isLoggedIn === undefined) {
        return res.redirect('/login');
    }
    next();
}