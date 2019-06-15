const User = require("../database/models/User");
const bcrypt = require("bcrypt");

module.exports = {
  getLoginPage: (req, res) => {
    res.render("login");
  },
  postUserLogin: (req, res) => {
    User.findOne({
      where: { name: req.body.username }
    })
      .then(foundUser => {
        // 4 - add compare(what the user inserts and the correspondent user password into db table)
        bcrypt.compare(req.body.password, foundUser.dataValues.password)
        .then(results => {
          if (req.body.username !== null && results) {
            req.session.user = foundUser.dataValues;
            res.redirect("/account");
          } else {
            console.log("Something went wrong when logging in");
            res.redirect("/login");
          }
        })
        .catch(error => console.error(`Couldn't login: ${error.stack}`));
        })
        .catch(error => console.error(`Something went wrong when comparing passwords: ${error.stack}`));
  }
};
