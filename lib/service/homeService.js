const homePage = {

    home: (req, res) => {
        res.render('home/home', {loginedMember: req.user});
    },
}

module.exports = homePage;