const express = require("express");
const { connector } = require("./server/database/configurations");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;
const routesController = require("./server/controllers/routesControllers");
const User = require("./server/database/models/User");
// Authentication
const session = require('cookie-session');
const cookieParser = require("cookie-parser");


//static files
app.use(express.static(__dirname + "/public"));

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(morgan("dev"));

app.set("view engine", "ejs");


app.use(cookieParser());
app.use(
    session({
        name: process.env.SESSION_COOKIE,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

/* custom middleware */
let isUserLoggedIn = (req, res, next) => {
    if(req.session.user && req.cookies){
        res.redirect("/profile")
    } else {
        next();
    }
}


app.get("/", isUserLoggedIn, routesController.getHome);

app.get("/register", routesController.getRegister);

app.post("/register", (req, res) => {
    User.create({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(results => {
        req.session.appUser = results.dataValues;
        console.log("User's session after registrtation: ", req.session.appUser);
        res.render("connect");
    })
    .catch(error => {
        console.error(`Cannot create user: ${error.stack}`);
    });
})

app.get("/auth/instagram", routesController.getAuth);

app.get("/handleauth", routesController.getHandleAuth);

app.get("/connect", routesController.getConnect);

app.get("/login", routesController.getLogin);

app.post("/login", (req, res) => {
    Uzer.findOne({ where: {name : req.body.username} })
    .then(foundUser => {
       if(req.body.username !== null && foundUser){
            req.session.user = foundUser.dataValues;
            res.redirect("/profile");
    } else {
        console.log("Something went wrong when logging in");
        res.redirect("/login")
    }})
    .catch(error => console.error(`Couldn't login: ${error.stack}`));
});

app.get("/profile", routesController.getProfile);

app.get("/logout", routesController.getLogout);









connector
.sync({ force: true })
.then(() =>{
    app.listen(port, () => console.log(`I've got hears on port: ${port}`));
})
.catch(error => console.error(`Couldn't syncronize with database: ${error.stack}`));