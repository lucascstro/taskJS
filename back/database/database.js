var sequelize = require("sequelize");
const connection = new sequelize ("taskbd","root","12345678",{host:"localhost", dialect: "mysql"});

module.exports = connection;