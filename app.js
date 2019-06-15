const express = require("express");
const { connector } = require("./server/database/configurations");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;

//controllers
const routesController = require("./server/controllers/routesControllers");
const {
  getRegistrationPage,
  postUserRegistration
} = require("./server/controllers/registerController");
const {
  getLoginPage,
  postUserLogin
} = require("./server/controllers/loginController");
const {
  getUsers,
  getSearchProfile
} = require("./server/controllers/searchController");
const {getAccount} = require("./server/controllers/accountControllers");

const axios = require("axios");

const Donation = require("./server/database/models/Donation");

// Authentication
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
// Encryption & Validation
const { check } = require("express-validator/check");

//static files
app.use(express.static(__dirname + "/public"));

//middleware
app.use(express.urlencoded({ extended: false }));
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
  if (req.session.user && req.cookies) {
    /* res.clearCookie("authCookie")
        console.log(req.session.user)
        console.log(req.cookies)  */
    res.redirect("/account");
  } else {
    next();
  }
};

app.get("/", routesController.getHome);

app.get("/register", isUserLoggedIn, getRegistrationPage);

app.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage(
        "Wrong formatted email. Use the correct format 'yourname@email.com'"
      )
  ],
  postUserRegistration
);

app.get("/login", isUserLoggedIn, getLoginPage);
app.post("/login", postUserLogin);

app.get("/account", getAccount);

app.get("/logout", routesController.getLogout);

app.get("/searchProfile", getSearchProfile);
app.post("/searchProfile", getUsers);

app.post("/thanks", (req, res) => {
  // console.log(req.body);
  Donation.create({
    amount: req.body.amount,
    userId: req.body.userId
  })
    .then(results => {
      axios({
        method: "get",
        url: "https://dog.ceo/api/breed/pug/images/random"
      })
        .then(response => {
          let pugImage = response.data.message;
          res.render("thanks", { randomPug: pugImage });
        })
        .catch(error =>
          console.error(
            `Something went wrong when getting data from api: ${error.stack}`
          )
        );
    })
    .catch(error => {
      console.error(`Something went wrong when donating: ${error.stack}`);
    });
});

connector
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`I've got hears on port: ${port}`));
  })
  .catch(error =>
    console.error(`Couldn't syncronize with database: ${error.stack}`)
  );
