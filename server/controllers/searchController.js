const User = require("../database/models/User");
require("../database/configurations");

module.exports = {
  getSearchProfile: (req, res) => {
    res.render("searchProfile");
  },

  getUsers: (req, res) => {
    User.findOne({
      where: { name: req.body.name }
    })
      .then(results => {
        
          if (req.body.name !== null && results) {
            /* console.log(results.dataValues) */
          res.render("searchProfile", { users: results.dataValues });
        } else {
          res.redirect("/");
        }
      })
      .catch(error =>
        console.error(
          `Something went wrong while searching for users: ${error.stack}`
        )
      );
  }
};
