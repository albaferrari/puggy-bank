const Donation = require("../database/models/Donation");

module.exports = {
  getAccount: (req, res) => {
    let numberOfDonations;
      Donation.findAll({ where: { userId: req.session.user.id } })
      .then(donationsNumber => {
        numberOfDonations = donationsNumber.length;
        console.log(numberOfDonations);
        //not returning numberOfDonations all the times
        //refresh page (??)
        if (req.session.user && req.cookies) {
          Donation.sum("amount", { where: { userId: req.session.user.id } })
            .then(results => {
              let noDonationsYet = "You have no donations yet";
              if (isNaN(results)) {
                console.log(numberOfDonations);
                res.render("account", { donations: noDonationsYet, number: "from " + numberOfDonations + "donations" });
              } else {
                res.render("account", { donations: "You earned " + results + "€", number: "from " + numberOfDonations + " donations" });
              }
            })
            .catch(error =>
              console.error(
                `Something went wrong while searching for the account: ${error.stack}`
              )
            );
        } else {
          res.redirect("/login");
        }
      })
      .catch(error =>
        console.error(
          `Something went wrong when counting donations: ${error.stack}`
        )
      );
  }

};
