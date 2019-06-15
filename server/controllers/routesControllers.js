module.exports = {
    getHome: (req, res) => {
        res.render ("index");
    },

    getLogout: (req, res) => {
        res.clearCookie("authCookie");
        res.clearCookie("authCookie.sig");
        res.redirect("/");
    },
}