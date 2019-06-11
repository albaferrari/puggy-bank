const pool = require ("../database/configurations");
const Instagram = require("node-instagram").default;
const {clientId, clientSecret} = require("../../keys").instagram;
const redirectUri = "http://localhost:3000/handleauth";


const instagram = new Instagram ({
    clientId: clientId,
    clientSecret: clientSecret
});

module.exports = {
    getHome: (req, res) => {
        res.render ("index");
    },

    getProfile: async (req, res) => {
            if (req.session.user && req.cookies.authCookie){
                res.render("profile");
            } else {
                res.redirect("/login");
            }

        try{
            const profileData = await instagram.get('users/self');
            const media = await instagram.get('users/self/media/recent');
            res.render ("profile", {user: profileData.data, posts: media.data});
            console.log(profileData.data.username);
        } catch(e) {
            console.log(e);
        }
    },

    getAuth: (req, res) => {
        res.redirect(
            instagram.getAuthorizationUrl(redirectUri, {
                scope: ['basic'],
                state: "your state"
            }))
    },

    getHandleAuth: async (req, res) => {
        try {
            const code = req.query.code;
            const data = await instagram.authorizeUser(code, redirectUri);

            req.session.access_token = data.access_token;
            req.session.user_id = data.user_id;
            instagram.config.accessToken = req.session.access_token;
            res.redirect('/profile');

            //console.log(data);
        } catch (e) {
            res.json(e);
        }
    },

    getRegister: (req, res) => {
        res.render("register")
    },

    getConnect: (req, res) => {
        res.redirect ("/auth/instagram");
    },

    getLogin: (req, res) => {
        res.render("login")
    },

    getLogout: (req, res) => {
        res.clearCookie("authCookie");
        res.redirect("/");
    }
}