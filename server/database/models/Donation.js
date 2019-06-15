const { connector, Sequelize } = require("../configurations")
const User = require("./User")

// 6 - Define models
const Donation = connector.define("donation", {
    amount: Sequelize.INTEGER,
})

User.hasMany(Donation);
Donation.belongsTo(User);

module.exports = Donation;