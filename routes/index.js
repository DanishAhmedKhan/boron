module.exports.home = (req, res) => {
    const error = req.session.error | '';
    res.render('home', {
        title: 'Boron invesment',
        error: error
    });
};