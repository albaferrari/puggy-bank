const User = require("../database/models/User");
const bcrypt = require ("bcrypt");
const { validationResult } = require("express-validator/check")

module.exports = {
    getRegistrationPage: (req, res) => {
      // 10 - render error if happens
      res.render("register", { errorMessage: req.session.error });
    },
    postUserRegistration: (req, res) => {
      // 8 validation
      const errors = validationResult(req);
  
      // 9 - check if const error has errors stored from the check in app.js
      //if there's an error send a message to the user (!error.isEmpty)=if error is not empty->redirect
      if(!errors.isEmpty()){
        req.session.error = errors.array();
        res.redirect("/register")
      }else{
        // 2 incoming password
      bcrypt
      .hash(req.body.password, 10)
      .then(hashPassword => {
        User.create({
          name: req.body.username,
          email: req.body.email,
          password: hashPassword,
          instagramUrl: "www.instagram.com/" + req.body.instagramUrl + "/"
        })
          .then(results => {
            req.session.appUser = results.dataValues;
            console.log("User's session after registrtation: ", req.session.appUser);
            res.redirect("/account");
          })
          .catch(error => {
            console.error(`Cannot create user: ${error.stack}`);
          });
      })
      .catch(error =>
          console.error(`Something went wrong when hashing password: ${error.stack}`)
        );
      }
    }
  };
  