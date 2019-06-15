const { connector, Sequelize } = require("../configurations")

// 6 - Define models
const User = connector.define("user", {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    instagramUrl: Sequelize.STRING
})

module.exports = User;